/*
ErroParametroInvalido retorna a mensagem personalizada
"Parametro invalido: nome do parametro" caso ocorra qualquer
erro inesperado na API
*/

export class ErroParametroInvalido extends Error {
  constructor (nomeDoParametro: string) {
    super(`Parametro invalido: ${nomeDoParametro}`)
    this.name = 'ErroParametroInvalido'
  }
}
