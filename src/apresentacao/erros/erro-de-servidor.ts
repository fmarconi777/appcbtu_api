export class ErroDeServidor extends Error {
  constructor () {
    super('Erro interno do servidor')
    this.name = 'ErroDeServidor'
  }
}
