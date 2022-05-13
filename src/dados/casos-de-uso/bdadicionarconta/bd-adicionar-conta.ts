import { AdicionarConta, InserirModeloFuncionario } from '../../../dominio/casos-de-uso/adicionarconta/cadastro-de-funcionario'
import { ModeloFuncionario } from '../../../dominio/modelos/cadastrofuncionario'
import { Encriptador } from '../../../apresentacao/protocolos/encriptador'

export class BdAdicionarConta implements AdicionarConta {
  private readonly encriptar: Encriptador
  constructor (encriptar: Encriptador) {
    this.encriptar = encriptar
  }

  async adicionar (conta: InserirModeloFuncionario): Promise<ModeloFuncionario> {
    await this.encriptar.encriptar(conta.senha)
    return await new Promise(resolve => resolve({
      id: '',
      nome: '',
      area: '',
      email: '',
      senha: ''
    }))
  }
}
