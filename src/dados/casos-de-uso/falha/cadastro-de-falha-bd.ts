import { CadastroDeFalha } from '../../../dominio/casos-de-uso/falha/cadastro-de-falha'
import { ModeloFalha } from '../../../dominio/modelos/falha'
import { RepositorioCadastroFalha } from '../../protocolos/bd/falha/repositorio-cadastro-falha'
import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'

export class CadastroDeFalhaBD implements CadastroDeFalha {
  constructor (
    private readonly validaEquipamento: ValidadorBD,
    private readonly repositorioCadastroFalha: RepositorioCadastroFalha
  ) {}

  async inserir (dados: ModeloFalha): Promise<string | null> {
    const equipamentoIdValido = await this.validaEquipamento.validar(dados.equipamentoId)
    if (equipamentoIdValido) {
      const data = new Date(Date.now() - 10800000).toISOString()
      const dataCriacao = (data.substring(0, 19) + 'Z')
      const falha = Object.assign({}, dados, { dataCriacao })
      return await this.repositorioCadastroFalha.inserir(falha)
    }
    return null
  }
}
