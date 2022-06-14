import { Validador } from '../../apresentacao/protocolos/validador'
import { validador } from '../auxiliares/auxiliar-validador'

/*
A classe ValidadorDeSigla faz uso do módulo validador para auxiliar
na validação das estações.
*/

export class ValidadorDeSigla implements Validador {
  validar (parametro: string): boolean {
    return validador.eSigla(parametro)
  }
}
