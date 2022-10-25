export class ErroMetodoInvalido extends Error {
  constructor () {
    super('Método inválido')
    this.name = 'ErroMetodoInvalido'
  }
}
