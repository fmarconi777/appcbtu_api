import { Validador } from '../../apresentacao/protocolos/validador'
import { validador } from '../auxiliares/auxiliar-validador'

/*
A classe ValidadorDeArea faz uso do módulo validador para auxiliar
na validação das estações.
*/

export class ValidadorDeArea implements Validador {
  validar (parametro: string): boolean {
    return validador.eArea(parametro)
  }
}
