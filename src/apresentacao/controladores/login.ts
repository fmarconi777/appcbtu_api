import { requisicaoImpropria } from '../auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { Validador } from '../protocolos/validador'

export class ControladorDeLogin implements Controlador {
  private readonly validadorDeEmail: Validador

  constructor (validadorDeEmail: Validador) {
    this.validadorDeEmail = validadorDeEmail
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const camposRequeridos = ['email', 'senha']
    for (const campo of camposRequeridos) {
      if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
        return requisicaoImpropria(new ErroFaltaParametro(campo))
      }
    }
    const { email } = requisicaoHttp.corpo
    const validar = this.validadorDeEmail.validar(email)
    if (!validar) {
      return requisicaoImpropria(new ErroParametroInvalido('email'))
    }
    return await new Promise(resolve => resolve({ status: 200, corpo: '' }))
  }
}
