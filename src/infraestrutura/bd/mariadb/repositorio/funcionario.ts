import { RepositorioFuncionario } from '../../../../dados/protocolos/bd/repositorio-funcionario'
import { InserirModeloFuncionario } from '../../../../dominio/casos-de-uso/funcionario/cadastro-de-funcionario'
import { ModeloFuncionario } from '../../../../dominio/modelos/funcionario'
import { Funcionario } from '../models/modelo-funcionarios'
import { FuncoesAuxiliares } from '../auxiliares/funcoes-auxiliares'

export class RepositorioFuncionarioMariaDB implements RepositorioFuncionario {
  async adicionar (dadosFuncionario: InserirModeloFuncionario): Promise<ModeloFuncionario> {
    const funcionario = await Funcionario.create(this.transformaDados(dadosFuncionario))
    return FuncoesAuxiliares.mapeadorDeDados(funcionario)
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
