import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'
import { AlteraAlerta } from '../../../dominio/casos-de-uso/alerta/altera-alerta'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'

export class AlteraAlertaBD implements AlteraAlerta {
  constructor (private readonly validadorDeAlerta: ValidadorBD) {}

  async alterar (dados: ModeloAlerta): Promise<string | null> {
    const alertaValido = await this.validadorDeAlerta.validar(+dados.id)
    if (alertaValido) {
      return await Promise.resolve('')
    }
    return null
  }
}
