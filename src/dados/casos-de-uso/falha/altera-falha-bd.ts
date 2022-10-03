import { AlteraFalha, FalhaAlterada, FalhaValida } from '../../../dominio/casos-de-uso/falha/altera-falha'
import { RepositorioAlteraFalha } from '../../protocolos/bd/falha/repositorio-altera-falha'
import { RepositorioConsultaFalha } from '../../protocolos/bd/falha/repositorio-consulta-falha'
import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'

export class AlteraFalhaBD implements AlteraFalha {
  constructor (
    private readonly repositorioConsultaFalha: RepositorioConsultaFalha,
    private readonly validaEquipamento: ValidadorBD,
    private readonly repositorioAlteraFalha: RepositorioAlteraFalha
  ) {}

  async alterar (dados: FalhaAlterada): Promise<FalhaValida> {
    const idValido = await this.repositorioConsultaFalha.consultar(dados.id)
    if (idValido) { //eslint-disable-line
      const equipamentoValido = await this.validaEquipamento.validar(dados.equipamentoId)
      if (equipamentoValido) {
        const falhaAlterada = await this.repositorioAlteraFalha.alterar(dados)
        return {
          falhaInvalida: false,
          parametro: falhaAlterada
        }
      }
      return {
        falhaInvalida: true,
        parametro: 'equipamentoId'
      }
    }
    return {
      falhaInvalida: true,
      parametro: 'id'
    }
  }
}
