import { AlteraFalha, FalhaAlterada, FalhaValida } from '../../../dominio/casos-de-uso/falha/altera-falha'
import { RepositorioConsultaFalha } from '../../protocolos/bd/falha/repositorio-consulta-falha'

export class AlteraFalhaBD implements AlteraFalha {
  constructor (
    private readonly repositorioConsultaFalha: RepositorioConsultaFalha
  ) {}

  async alterar (dados: FalhaAlterada): Promise<FalhaValida> {
    await this.repositorioConsultaFalha.consultar(dados.id)
    return {
      falhaInvalida: false,
      parametro: ''
    }
  }
}
