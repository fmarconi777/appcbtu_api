export class ErroDeServidor extends Error {
  constructor (stack: string) {
    super('Erro interno do servidor')
    this.name = 'ErroDeServidor'
    this.stack = stack
  }
}
