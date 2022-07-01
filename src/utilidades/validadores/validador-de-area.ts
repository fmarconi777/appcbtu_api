import { ValidadorBD } from '../../apresentacao/protocolos/validadorBD'
import { ConsultaArea } from '../../dominio/casos-de-uso/area/consulta-area'

export class ValidadorDeArea implements ValidadorBD {
  constructor (private readonly consultaArea: ConsultaArea) {}
  async validar (parametro: string): Promise<boolean> {
    const listaAreas = await this.consultaArea.consultarTodas()
    return listaAreas.some(area => area.nome === parametro)
  }
}
