import { requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'

export class ControladorDeFalha implements Controlador {
  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    switch (metodo) {
      case 'POST':
      {
        return resposta('')
      }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
