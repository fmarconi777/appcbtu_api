import { requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'

export class ControladorDeTelefone implements Controlador {
  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    switch (metodo) {
      case 'POST':
      { if (!requisicaoHttp.corpo.numero) { // eslint-disable-line
        return requisicaoImpropria(new ErroFaltaParametro('numero'))
      }
      return resposta('') }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
