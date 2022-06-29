import { DeletaArea } from '../../../dominio/casos-de-uso/area/deleta-area'
import { RepositorioDeletaArea } from '../../protocolos/bd/area/repositorio-deleta-area'

export class DeletaAreaBD implements DeletaArea {
  constructor (private readonly repositorioDeletaArea: RepositorioDeletaArea) {}

  async deletar (area: string): Promise<string> {
    const areaDeleta = await this.repositorioDeletaArea.deletar(area)
    return areaDeleta
  }
}
