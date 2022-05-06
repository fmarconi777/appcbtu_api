import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { Validador } from '../protocolos/validador'
export class ControladorDeCadastro implements Controlador {
  private readonly validadorDeEmail: Validador
  constructor (validadorDeEmail: Validador) {
    this.validadorDeEmail = validadorDeEmail
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const camposRequeridos = ['nome', 'email', 'area', 'senha', 'confirmarSenha']
    for (const campo of camposRequeridos) {
      if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
        return requisicaoImpropria(new ErroParametroInvalido(campo))
      }
    }
    const validar = this.validadorDeEmail.validar(requisicaoHttp.corpo.email)
    if (!validar) {
      return requisicaoImpropria(new ErroParametroInvalido('email'))
    }
    return resposta('retornou')
  }
}
