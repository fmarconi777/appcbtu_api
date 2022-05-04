import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'

export class ControladorDeCadastro {
  tratar (requisicaoHttp: RequisicaoHttp): RespostaHttp {
    return {
      status: 400,
      corpo: new Error('Falta parametro: nome ')
    }
  }
}
