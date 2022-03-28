import { ConsultaEstacao } from '../../dominio/caos-de-uso/consulta-estacao'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { resposta } from '../utilitarios/utilitario-http'

export class ControladorDeEstacao implements Controlador {
  private readonly consultaEstacao: ConsultaEstacao

  constructor (consultaEstacao: ConsultaEstacao) {
    this.consultaEstacao = consultaEstacao
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    if (!requisicaoHttp.corpo) { // eslint-disable-line
      const todasEstacoes = await this.consultaEstacao.consultaTodas()
      return resposta(todasEstacoes)
    }
    return {
      codigoDeStatus: 1,
      corpo: 'any'
    }
  }
}
