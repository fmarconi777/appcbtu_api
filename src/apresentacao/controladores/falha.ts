import { requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { ValidadorBD } from '../protocolos/validadorBD'

export class ControladorDeFalha implements Controlador {
  constructor (private readonly validaEquipamento: ValidadorBD) {}

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    switch (metodo) {
      case 'POST':
      {
        const camposRequeridos = ['numFalha', 'equipamentoId']
        for (const campo of camposRequeridos) {
          if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
            return requisicaoImpropria(new ErroFaltaParametro(campo))
          }
        }
        await this.validaEquipamento.validar(+requisicaoHttp.corpo.equipamentoId)
        return resposta('')
      }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
