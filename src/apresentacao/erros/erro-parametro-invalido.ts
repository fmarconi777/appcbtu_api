export class ErroParametroInvalido extends Error {
  constructor (nomeDoParametro: string) {
    super(`Parametro invalido: ${nomeDoParametro}`)
    this.name = 'ErroParametroInvalido'
  }
}
