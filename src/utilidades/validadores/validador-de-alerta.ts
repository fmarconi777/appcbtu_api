import { ValidadorBD } from '../../dados/protocolos/utilidades/validadorBD'
import { ConsultaAlerta } from '../../dominio/casos-de-uso/alerta/consulta-alerta'

export class ValidadorDeAlerta implements ValidadorBD {
  constructor (private readonly consultaAlerta: ConsultaAlerta) {}
  async validar (id: number): Promise<boolean> {
    const listaAlertas = await this.consultaAlerta.consultarTodas()
    return listaAlertas.some(alerta => +alerta.id === +id)
  }
}
