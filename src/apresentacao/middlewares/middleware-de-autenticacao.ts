import { Middleware } from '../protocolos/middleware'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { requisicaoNegada } from '../auxiliares/auxiliar-http'
import { ErroAcessoNegado } from '../erros/erro-acesso-negado'

export class MiddlewareDeAutenticacao implements Middleware {
  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    return await new Promise(resolve => resolve(requisicaoNegada(new ErroAcessoNegado())))
  }
}
