import { Validador } from '../../apresentacao/protocolos/validador'
import validator from 'validator'
export class ValidadorDeEmailAdaptador implements Validador {
  validar (parametro: string): boolean {
    return validator.isEmail(parametro)
  }
}
