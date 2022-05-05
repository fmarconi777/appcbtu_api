import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
export class ControladorDeCadastro implements Controlador {
  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const camposRequeridos = ['nome', 'email', 'area', 'senha', 'confirmarSenha']
    for (const campo of camposRequeridos) {
      if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
        return requisicaoImpropria(new ErroFaltaParametro(campo))
      }
    }
    return resposta('retornou')
  }
}
