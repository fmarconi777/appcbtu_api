import { RepositorioFuncionario, InserirModeloFuncionario, ModeloFuncionario } from '../../../../dados/protocolos/bd/repositorio-funcionario'
import { Funcionario } from '../models/modelo-funcionarios'
import { FuncoesAuxiliares } from '../auxiliares/funcoes-auxiliares'
import { RepositorioConsultaFuncionarioPorEmail } from '../../../../dados/protocolos/bd/repositorio-consulta-funcionario-por-email'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'

export class RepositorioFuncionarioMariaDB implements RepositorioFuncionario, RepositorioConsultaFuncionarioPorEmail {
  async adicionar (dadosFuncionario: InserirModeloFuncionario): Promise<ModeloFuncionario> {
    AuxiliaresMariaDB.verificaConexao()
    const funcionario = await Funcionario.create(this.transformaDados(dadosFuncionario))
    return FuncoesAuxiliares.mapeadorDeDados(funcionario)
  }

  async consultaPorEmail (email: string): Promise<ModeloFuncionario | null> {
    AuxiliaresMariaDB.verificaConexao()
    const funcionario = await Funcionario.findOne({ where: { email } })
    return funcionario ? FuncoesAuxiliares.mapeadorDeDados(funcionario) : null // eslint-disable-line
  }

  private transformaDados (dadosFuncionario: InserirModeloFuncionario): any {
    const { nome, email, senha, areaId, administrador } = dadosFuncionario
    return {
      nome: nome,
      email: email,
      senha: senha,
      areaId: +areaId,
      administrador: (administrador === 'true')
    }
  }
}
