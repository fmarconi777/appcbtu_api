/*
ErroParametroInvalido retorna a mensagem personalizada
"Parametro invalido: nome do parametro" caso ocorra qualquer
erro inesperado na API
*/

export class ErroFaltaParametro extends Error {
  constructor (nomeDoParametro: string) {
    super(`Parametro não informado: ${nomeDoParametro}`)
    this.name = 'ErroFaltaParametro'
  }
}
