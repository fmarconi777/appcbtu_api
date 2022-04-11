/*
Esta interface define os métodos com os quais a classe ValidaParametro
deve ser implementada na pasta de utilidades, o que deve receber e o que
deve retornar.
*/

export interface ValidaParametro {
  validar: (parametro: string) => boolean
}
