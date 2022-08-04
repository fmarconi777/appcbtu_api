import { ValidadorBD } from '../../apresentacao/protocolos/validadorBD'
import { ConsultaAlerta } from '../../dominio/casos-de-uso/alerta/consulta-alerta'
export class ValidadorDeAlerta implements ValidadorBD {
  constructor (private readonly consultaAlerta: ConsultaAlerta) {}
  async validar (parametro: string): Promise<boolean> {
    const listaAlertas = await this.consultaAlerta.consultarTodas()
    return listaAlertas.some(alerta => alerta.id === parametro)
  }
}
