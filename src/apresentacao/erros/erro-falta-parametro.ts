export class ErroFaltaParametro extends Error {
  constructor (nomeDoParametro: string) {
    super(`Parametro não informado: ${nomeDoParametro}`)
    this.name = 'ErroFaltaParametro'
  }
}
