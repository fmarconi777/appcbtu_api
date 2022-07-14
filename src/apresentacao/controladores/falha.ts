import { requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'

export class ControladorDeFalha implements Controlador {
  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    switch (metodo) {
      case 'POST':
      {
        const camposRequeridos = ['numFalha']
        for (const campo of camposRequeridos) {
          if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
            return requisicaoImpropria(new ErroFaltaParametro(campo))
          }
        }
        return resposta('')
      }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
