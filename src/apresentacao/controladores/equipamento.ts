import { requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'

export class ControladorDeEquipamento implements Controlador {
  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const camposRequeridos = ['nome', 'tipo', 'num_falha', 'estado', 'estacaoId']
    for (const campo of camposRequeridos) {
      if(!requisicaoHttp.corpo[campo]) { // eslint-disable-line
        return requisicaoImpropria(new ErroFaltaParametro(campo))
      }
    }
    return resposta('resposta')
  }
}
