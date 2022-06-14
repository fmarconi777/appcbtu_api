import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { resposta, requisicaoNaoEncontrada, erroDeServidor, requisicaoImpropria } from '../auxiliares/auxiliar-http'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { Validador } from '../protocolos/validador'
import { ConsultaArea } from '../../dominio/casos-de-uso/area/consulta-area'

export class ControladorDeArea implements Controlador {
  constructor (
    private readonly consultaArea: ConsultaArea,
    private readonly validaArea: Validador
  ) {}

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    switch (metodo) {
      case 'GET':
        try {
          const parametro = requisicaoHttp.parametro
          if (!parametro) { // eslint-disable-line
            const todasAreas = await this.consultaArea.consultarTodas()
            return resposta(todasAreas)
          }
          const areaValida = this.validaArea.validar(parametro)
          if (!areaValida) {
            return requisicaoNaoEncontrada(new ErroParametroInvalido('sigla'))
          }
          const area = await this.consultaArea.consultar(parametro)
          return resposta(area)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}