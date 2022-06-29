import { Validador } from '../../apresentacao/protocolos/validador'
import { validador } from '../auxiliares/auxiliar-validador'

export class ValidadorDeAlerta implements Validador {
  validar (parametro: string): boolean {
    return validador.eAlerta(parametro)
  }
}
