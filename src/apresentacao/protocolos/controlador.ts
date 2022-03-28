import { RequisicaoHttp, RespostaHttp } from './http'

export interface Controlador {
  tratar: (requisicaoHttp: RequisicaoHttp) => Promise<RespostaHttp>
}
