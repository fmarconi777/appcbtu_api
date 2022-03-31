import { ValidaParametro } from '../apresentacao/protocolos/valida-parametro'
import { validador } from './auxiliares/auxiliar-validador'

export class ValidadorDeParametro implements ValidaParametro {
  validar (parametro: string): boolean {
    return validador.eSigla(parametro)
  }
}
