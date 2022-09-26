import { CadastroDeFalha, DadosFalha } from '../../../dominio/casos-de-uso/falha/cadastro-de-falha'
import { RepositorioCadastroFalha } from '../../protocolos/bd/falha/repositorio-cadastro-falha'
import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'

export class CadastroDeFalhaBD implements CadastroDeFalha {
  constructor (
    private readonly validaEquipamento: ValidadorBD,
    private readonly repositorioCadastroFalha: RepositorioCadastroFalha
  ) {}

  async inserir (dados: DadosFalha): Promise<string | null> {
    const equipamentoIdValido = await this.validaEquipamento.validar(dados.equipamentoId)
    if (equipamentoIdValido) {
      return await this.repositorioCadastroFalha.inserir(dados)
    }
    return null
  }
}
