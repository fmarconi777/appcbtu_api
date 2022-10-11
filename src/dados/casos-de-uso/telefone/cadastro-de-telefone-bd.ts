import { CadastroDeTelefone } from '../../../dominio/casos-de-uso/telefone/cadastro-de-telefone'
import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'

export class CadastroDeTelefoneBD implements CadastroDeTelefone {
  constructor (
    private readonly validaEstacao: ValidadorBD
  ) {}

  async inserir (numero: number, estacaoId: number): Promise<string | null> {
    await this.validaEstacao.validar(estacaoId)
    return await Promise.resolve('')
  }
}
