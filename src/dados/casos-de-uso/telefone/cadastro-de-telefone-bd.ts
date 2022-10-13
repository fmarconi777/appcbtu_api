import { CadastroDeTelefone, DadosTelefone } from '../../../dominio/casos-de-uso/telefone/cadastro-de-telefone'
import { RepositorioCadastroTelefone } from '../../protocolos/bd/telefone/repositorio-cadastro-telefone'
import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'

export class CadastroDeTelefoneBD implements CadastroDeTelefone {
  constructor (
    private readonly validaEstacao: ValidadorBD,
    private readonly repositorioCadastroTelefone: RepositorioCadastroTelefone
  ) {}

  async inserir (dados: DadosTelefone): Promise<string | null> {
    const estacaoValida = await this.validaEstacao.validar(dados.estacaoId)
    if (estacaoValida) {
      return await this.repositorioCadastroTelefone.inserir(dados)
    }
    return null
  }
}
