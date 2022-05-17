import { Controlador } from '../../apresentacao/protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../../apresentacao/protocolos/http'

export class DecoradorControladorLog implements Controlador {
  private readonly controlador: Controlador

  constructor (controlador: Controlador) {
    this.controlador = controlador
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const respostaHttp = await this.controlador.tratar(requisicaoHttp)
    if (respostaHttp.status === 500) {
      console.log('deu erro')
    }
    return respostaHttp
  }
}
