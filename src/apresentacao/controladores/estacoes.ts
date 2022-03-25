export class ControladorDeEstacoes {
  tratar (requisicaoHttp: any): any {
    if (!requisicaoHttp) { // eslint-disable-line
      return {
        codigoDeStatus: 200,
        corpo: {
          Estação: 'Todas as estações'
        }
      }
    }
  }
}
