import { requisicaoImpropria } from '../auxiliares/auxiliar-http'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'

export class ControladorDeTelefone implements Controlador {
  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    switch (metodo) {
      case 'POST':
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
