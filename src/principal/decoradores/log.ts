import { Controlador } from '../../apresentacao/protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../../apresentacao/protocolos/http'
import { RepositorioLogDeErro } from '../../dados/protocolos/repositorio-log-de-erro'

export class DecoradorControladorLog implements Controlador {
  private readonly controlador: Controlador
  private readonly repositorioLogDeErro: RepositorioLogDeErro

  constructor (controlador: Controlador, repositorioLogDeErro: RepositorioLogDeErro) {
    this.controlador = controlador
    this.repositorioLogDeErro = repositorioLogDeErro
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const respostaHttp = await this.controlador.tratar(requisicaoHttp)
    if (respostaHttp.status === 500) {
      await this.repositorioLogDeErro.logErro(respostaHttp.corpo.stack)
    }
    return respostaHttp
  }
}
