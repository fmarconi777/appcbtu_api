import { ConsultaArea } from '@/dominio/casos-de-uso/area/consulta-area'
import { ValidadorBD } from '@/dados/protocolos/utilidades/validadorBD'

export class ValidadorDeArea implements ValidadorBD {
  constructor (private readonly consultaArea: ConsultaArea) {}
  async validar (nome: string): Promise<boolean> {
    const listaAreas = await this.consultaArea.consultarTodas()
    return listaAreas.some(area => area.nome === nome)
  }
}
