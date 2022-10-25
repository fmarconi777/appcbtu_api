import { DeletaArea } from '@/dominio/casos-de-uso/area/deleta-area'
import { RepositorioDeletaArea } from '@/dados/protocolos/bd/area/repositorio-deleta-area'
import { ValidadorBD } from '@/dados/protocolos/utilidades/validadorBD'

export class DeletaAreaBD implements DeletaArea {
  constructor (
    private readonly validaArea: ValidadorBD,
    private readonly repositorioDeletaArea: RepositorioDeletaArea
  ) {}

  async deletar (nome: string): Promise<string | null> {
    const areaValida = await this.validaArea.validar(nome)
    if (areaValida) {
      const areaDeleta = await this.repositorioDeletaArea.deletar(nome)
      return areaDeleta
    }
    return null
  }
}
