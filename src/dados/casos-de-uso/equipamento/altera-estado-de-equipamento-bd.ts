import { AlteraEstadoDeEquipamento, EstadoEquipamento } from '../../../dominio/casos-de-uso/equipamento/altera-estado-de-equipamento'
import { RepositorioAlteraEstadoDeEquipamento } from '../../protocolos/bd/equipamento/repositorio-altera-estado-de-equipamento'
import { RepositorioConsultaEquipamento } from '../../protocolos/bd/equipamento/repositorio-consulta-equipamento'

export class AlteraEstadoDeEquipamentoBD implements AlteraEstadoDeEquipamento {
  constructor (
    private readonly repositorioConsultaEquipamento: RepositorioConsultaEquipamento,
    private readonly repositorioAlteraEstadoDeEquipamento: RepositorioAlteraEstadoDeEquipamento
  ) {}

  async alterar (dadosEquipamento: EstadoEquipamento): Promise<string | null> {
    const equipamento = await this.repositorioConsultaEquipamento.consultar(+dadosEquipamento.id)
    if (equipamento) { // eslint-disable-line
      return await this.repositorioAlteraEstadoDeEquipamento.alterarEstado(dadosEquipamento)
    }
    return equipamento
  }
}
