import { ConsultaEstacao } from '../../dominio/caos-de-uso/consulta-estacao'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { resposta, requisicaoImpropria, erroDeServidor } from '../auxiliares/auxiliar-http'
import { ValidaParametro } from '../protocolos/valida-parametro'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'

export class ControladorDeEstacao implements Controlador {
  private readonly consultaEstacao: ConsultaEstacao
  private readonly validaParametro: ValidaParametro

  constructor (consultaEstacao: ConsultaEstacao, validaParametro: ValidaParametro) {
    this.consultaEstacao = consultaEstacao
    this.validaParametro = validaParametro
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    try {
      const parametro = requisicaoHttp.corpo
      if (!parametro) { // eslint-disable-line
        const todasEstacoes = await this.consultaEstacao.consultaTodas()
        return resposta(todasEstacoes)
      }
      const parametroValido = this.validaParametro.validar(parametro)
      if (!parametroValido) {
        return requisicaoImpropria(new ErroParametroInvalido('sigla'))
      }
      const estacao = await this.consultaEstacao.consulta(parametro)
      return resposta(estacao)
    } catch (erro) {
      return erroDeServidor()
    }
  }
}
