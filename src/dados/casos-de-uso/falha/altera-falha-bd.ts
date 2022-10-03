import { AlteraFalha, FalhaAlterada, FalhaValida } from '../../../dominio/casos-de-uso/falha/altera-falha'
import { RepositorioConsultaFalha } from '../../protocolos/bd/falha/repositorio-consulta-falha'
import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'

export class AlteraFalhaBD implements AlteraFalha {
  constructor (
    private readonly repositorioConsultaFalha: RepositorioConsultaFalha,
    private readonly validaEquipamento: ValidadorBD
  ) {}

  async alterar (dados: FalhaAlterada): Promise<FalhaValida> {
    const idValido = await this.repositorioConsultaFalha.consultar(dados.id)
    if (idValido) { //eslint-disable-line
      const equipamentoValido = await this.validaEquipamento.validar(dados.equipamentoId)
      if (equipamentoValido) {
        return {
          falhaInvalida: false,
          parametro: ''
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
