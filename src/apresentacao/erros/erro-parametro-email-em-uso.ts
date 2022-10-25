export class ErroEmailEmUso extends Error {
  constructor () {
    super('O email recebido já está em uso')
    this.name = 'ErroEmailEmUso'
  }
}
