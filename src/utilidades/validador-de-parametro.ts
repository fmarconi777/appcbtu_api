import { Validador } from '../apresentacao/protocolos/validador'
import { validador } from './auxiliares/auxiliar-validador'

/*
A classe ValidadorDeParametro faz uso do módulo validador para auxiliar
na validação das estações.
*/

export class ValidadorDeParametro implements Validador {
  validar (parametro: string): boolean {
    return validador.eSigla(parametro)
  }
}
