import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
export class ControladorDeCadastro implements Controlador {
  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const camposRequeridos = ['nome', 'email', 'area', 'senha', 'confirmarSenha']
    for (const campo of camposRequeridos) {
      if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
        return requisicaoImpropria(new ErroParametroInvalido(campo))
      }
    }
    return resposta('retornou')
  }
}
