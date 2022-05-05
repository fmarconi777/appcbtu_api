import { ConsultaEstacao } from '../../dominio/casos-de-uso/consulta-estacao'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { resposta, requisicaoImpropria, erroDeServidor } from '../auxiliares/auxiliar-http'
import { Validador } from '../protocolos/validador'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'

/*
A classe ControladorDeEstacao ao ser instanciada recebe duas outras classes
como parâmetro, as classes ConsultaEstacao e ValidaParametro.
O método tratar desta classes tem duas responsabilidades, que é retornar
todas as estações, caso o parâmetro passado seja nulo ou produza o valor false
no teste booleano, e retornar uma estação especifica caso o parâmetro recebido
seja válido.
*/
export class ControladorDeEstacao implements Controlador {
  private readonly consultaEstacao: ConsultaEstacao
  private readonly validaParametro: Validador

  constructor (consultaEstacao: ConsultaEstacao, validaParametro: Validador) {
    this.consultaEstacao = consultaEstacao
    this.validaParametro = validaParametro
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    try {
      const parametro = requisicaoHttp.parametro
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
