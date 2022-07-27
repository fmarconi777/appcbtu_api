import { AlteraEstadoDeEquipamento, EstadoEquipamento } from '../../../dominio/casos-de-uso/equipamento/altera-estado-de-equipamento'
import { RepositorioConsultaEquipamento } from '../../protocolos/bd/equipamento/repositorio-consulta-equipamento'

export class AlteraEstadoDeEquipamentoBD implements AlteraEstadoDeEquipamento {
  constructor (
    private readonly repositorioConsultaEquipamento: RepositorioConsultaEquipamento
  ) {}

  async alterar (dadosEquipamento: EstadoEquipamento): Promise<string | null> {
    await this.repositorioConsultaEquipamento.consultar(+dadosEquipamento.id)
    return await new Promise(resolve => resolve(''))
  }
}
