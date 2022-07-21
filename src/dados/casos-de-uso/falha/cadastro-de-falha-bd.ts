import { CadastroDeFalha } from '../../../dominio/casos-de-uso/falha/cadastro-de-falha'
import { ModeloFalha } from '../../../dominio/modelos/falha'
import { RepositorioCadastroFalha } from '../../protocolos/bd/falha/repositorio-cadastro-falha'

export class CadastroDeFalhaBD implements CadastroDeFalha {
  constructor (private readonly repositorioCadastroFalha: RepositorioCadastroFalha) {}

  async inserir (dados: ModeloFalha): Promise<string> {
    const data = new Date(Date.now() - 10800000).toISOString()
    const dataCriacao = (data.substring(0, 19) + 'Z')
    const falha = Object.assign({}, dados, { dataCriacao })
    await this.repositorioCadastroFalha.inserir(falha)
    return await new Promise(resolve => resolve(''))
  }
}
