export class ErroAcessoNegado extends Error {
  constructor () {
    super('Acesso negado')
    this.name = 'ErroAcessoNegado'
  }
}
