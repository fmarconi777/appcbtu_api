/*
ErroParametroInvalido retorna a mensagem personalizada
"Parametro invalido: nome do parametro" caso ocorra qualquer
erro inesperado na API
*/

export class ErroEmailEmUso extends Error {
  constructor () {
    super('O email recebido já está em uso')
    this.name = 'ErroEmailEmUso'
  }
}
