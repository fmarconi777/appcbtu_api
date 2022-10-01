import { AlteraFalha, FalhaAlterada, FalhaValida } from '../../../dominio/casos-de-uso/falha/altera-falha'
import { RepositorioConsultaFalha } from '../../protocolos/bd/falha/repositorio-consulta-falha'

export class AlteraFalhaBD implements AlteraFalha {
  constructor (
    private readonly repositorioConsultaFalha: RepositorioConsultaFalha
  ) {}

  async alterar (dados: FalhaAlterada): Promise<FalhaValida> {
    const idValido = await this.repositorioConsultaFalha.consultar(dados.id)
    if (idValido) { //eslint-disable-line
      return {
        falhaInvalida: false,
        parametro: ''
      }
    }
    return {
      falhaInvalida: true,
      parametro: 'id'
    }
  }
}
