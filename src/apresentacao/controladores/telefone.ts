import { requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'

export class ControladorDeTelefone implements Controlador {
  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    switch (metodo) {
      case 'POST':
      {
        const camposRequeridos = ['numero', 'estacaoId']
        for (const campo of camposRequeridos) {
          if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
            return requisicaoImpropria(new ErroFaltaParametro(campo))
          }
        }
        const numero = +requisicaoHttp.corpo.numero
        if (!Number.isInteger(numero) || numero !== Math.abs(numero)) {
          return requisicaoImpropria(new ErroParametroInvalido('numero'))
        }
        return resposta('')
      }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
