export class ControladorDeEstacoes {
  tratar (requisicaoHttp: any): any {
    return {
      codigoDeStatus: 400,
      corpo: new Error('Falta parametro: todos ou id')
    }
  }
}
