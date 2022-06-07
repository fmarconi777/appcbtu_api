/*
ErroParametroInvalido retorna a mensagem personalizada
"Parametro invalido: nome do parametro" caso ocorra qualquer
erro inesperado na API
*/

export class ErroAcessoNegado extends Error {
  constructor () {
    super('Acesso negado')
    this.name = 'ErroAcessoNegado'
  }
}
