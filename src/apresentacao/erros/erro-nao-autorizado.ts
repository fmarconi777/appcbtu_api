export class ErroDeAutorizacao extends Error {
  constructor () {
    super('Não autorizado')
    this.name = 'ErroDeAutorizacao'
  }
}
