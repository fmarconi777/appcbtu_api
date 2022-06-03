/*
ErroParametroInvalido retorna a mensagem personalizada "Erro interno do servidor"
*/

export class ErroMetodoInvalido extends Error {
  constructor () {
    super('Método inválido')
    this.name = 'ErroMetodoInvalido'
  }
}
