import { ValidaParametro } from '../apresentacao/protocolos/valida-parametro'
import { validador } from './auxiliares/auxiliar-validador'

/*
A classe ValidadorDeParametro faz uso do módulo validador para auxiliar
na validação das estações.
*/

export class ValidadorDeParametro implements ValidaParametro {
  validar (parametro: string): boolean {
    return validador.eSigla(parametro)
  }
}
