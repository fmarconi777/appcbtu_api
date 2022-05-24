/*
ErroParametroInvalido retorna a mensagem personalizada "Erro interno do servidor"
*/

export class ErroDeAutorizacao extends Error {
  constructor () {
    super('Não autorizado')
    this.name = 'ErroDeAutorizacao'
  }
}
