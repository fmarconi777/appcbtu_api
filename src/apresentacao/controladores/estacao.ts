import { ConsultaEstacao } from '../../dominio/caos-de-uso/consulta-estacao'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { resposta } from '../auxiliares/auxiliar-http'

export class ControladorDeEstacao implements Controlador {
  private readonly consultaEstacao: ConsultaEstacao

  constructor (consultaEstacao: ConsultaEstacao) {
    this.consultaEstacao = consultaEstacao
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const parametro = requisicaoHttp.corpo
    if (!parametro) { // eslint-disable-line
      const todasEstacoes = await this.consultaEstacao.consultaTodas()
      return resposta(todasEstacoes)
    }
    const estacao = await this.consultaEstacao.consulta(parametro)
    return resposta(estacao)
  }
}
