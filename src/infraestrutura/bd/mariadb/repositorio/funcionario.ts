import { RepositorioFuncionario, InserirModeloFuncionario, ModeloFuncionario } from '@/dados/protocolos/bd/funcionario/repositorio-funcionario'
import { RepositorioConsultaFuncionarioPorEmail } from '@/dados/protocolos/bd/funcionario/repositorio-consulta-funcionario-por-email'
import { RepositorioConsultaFuncionarioPorId } from '@/dados/protocolos/bd/funcionario/repositorio-consulta-funcionario-por-id'
import { ConsultaFuncionarioPorNome } from '@/dados/protocolos/bd/funcionario/repositorio-consulta-funcionario-por-nome'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Funcionario, Op } from '@/infraestrutura/bd/mariadb/models/modelo-funcionarios'
import { FuncoesAuxiliares } from '@/infraestrutura/bd/mariadb/auxiliares/funcoes-auxiliares'

export class RepositorioFuncionarioMariaDB implements RepositorioFuncionario,
RepositorioConsultaFuncionarioPorEmail,
RepositorioConsultaFuncionarioPorId,
ConsultaFuncionarioPorNome {
  async adicionar (dadosFuncionario: InserirModeloFuncionario): Promise<ModeloFuncionario> {
    AuxiliaresMariaDB.verificaConexao()
    const funcionario = await Funcionario.create(this.transformaDados(dadosFuncionario))
    return FuncoesAuxiliares.mapeadorDeDados(funcionario)
  }

  async consultarPorEmail (email: string): Promise<ModeloFuncionario | null> {
    AuxiliaresMariaDB.verificaConexao()
    const funcionario = await Funcionario.findOne({ where: { email } })
    return funcionario ? FuncoesAuxiliares.mapeadorDeDados(funcionario) : null // eslint-disable-line
  }

  async consultarPorId (id: string, nivel?: string | undefined): Promise<ModeloFuncionario | null> {
    AuxiliaresMariaDB.verificaConexao()
    if (nivel === 'admin') {
      const funcionario = await Funcionario.findOne({ where: { id, administrador: true } })
      return funcionario ? FuncoesAuxiliares.mapeadorDeDados(funcionario) : null // eslint-disable-line
    }
    const funcionario = nivel === undefined ? await Funcionario.findOne({ where: { id } }) : await Funcionario.findOne({ where: { id, [Op.or]: { areaId: nivel, administrador: true } } })
    return funcionario ? FuncoesAuxiliares.mapeadorDeDados(funcionario) : null // eslint-disable-line
  }

  async consultarPorNome (nome: string): Promise<ModeloFuncionario | null> {
    AuxiliaresMariaDB.verificaConexao()
    const funcionario = await Funcionario.findOne({ where: { nome } })
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
