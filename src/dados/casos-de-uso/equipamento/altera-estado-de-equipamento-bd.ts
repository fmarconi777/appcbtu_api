import { AlteraEstadoDeEquipamento, EstadoEquipamento } from '../../../dominio/casos-de-uso/equipamento/altera-estado-de-equipamento'
import { RepositorioConsultaEquipamento } from '../../protocolos/bd/equipamento/repositorio-consulta-equipamento'

export class AlteraEstadoDeEquipamentoBD implements AlteraEstadoDeEquipamento {
  constructor (
    private readonly repositorioConsultaEquipamento: RepositorioConsultaEquipamento
  ) {}

  async alterar (dadosEquipamento: EstadoEquipamento): Promise<string | null> {
    const equipamento = await this.repositorioConsultaEquipamento.consultar(+dadosEquipamento.id)
    if (equipamento) { // eslint-disable-line
      return await new Promise(resolve => resolve(''))
    }
    return equipamento
  }
}
