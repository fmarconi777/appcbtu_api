import { DeletaAlerta } from '../../../dominio/casos-de-uso/alerta/deleta-alerta'
import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'

export class DeletaAlertaBD implements DeletaAlerta {
  constructor (
    private readonly validadorDeAlerta: ValidadorBD
  ) {}

  async deletar (id: number): Promise<string | null> {
    const alertaValido = await this.validadorDeAlerta.validar(id)
    if (alertaValido) {
      return await Promise.resolve('')
    }
    return null
  }
}
