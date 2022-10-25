import { RequisicaoHttp, RespostaHttp } from './http'

export interface Middleware {
  tratar: (requisicaoHttp: RequisicaoHttp) => Promise<RespostaHttp>
}
