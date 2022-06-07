import { RequisicaoHttp, RespostaHttp } from './http'

/*
A interface Controlador define que as classes do tipo Controlador devem
ter ao menos o método tratar, o que ele deve receber e o que deve retornar
*/

export interface Middleware {
  tratar: (requisicaoHttp: RequisicaoHttp) => Promise<RespostaHttp>
}
