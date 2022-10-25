import { ConsultaEstacao } from '@/dominio/casos-de-uso/estacao/consulta-estacao'
import { Controlador } from '@/apresentacao/protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '@/apresentacao/protocolos/http'
import { resposta, requisicaoNaoEncontrada, erroDeServidor, requisicaoImpropria } from '@/apresentacao/auxiliares/auxiliar-http'
import { Validador } from '@/apresentacao/protocolos/validador'
import { ErroParametroInvalido } from '@/apresentacao/erros/erro-parametro-invalido'
import { ErroMetodoInvalido } from '@/apresentacao/erros/erro-metodo-invalido'

export class ControladorDeEstacao implements Controlador {
  private readonly consultaEstacao: ConsultaEstacao
  private readonly validaParametro: Validador

  constructor (consultaEstacao: ConsultaEstacao, validaParametro: Validador) {
    this.consultaEstacao = consultaEstacao
    this.validaParametro = validaParametro
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    switch (metodo) {
      case 'GET':
        try {
          const parametro = requisicaoHttp.parametro
          if (!parametro) { // eslint-disable-line
            const todasEstacoes = await this.consultaEstacao.consultarTodas()
            return resposta(todasEstacoes)
          }
          const parametroValido = this.validaParametro.validar(parametro.toLowerCase())
          if (!parametroValido) {
            return requisicaoNaoEncontrada(new ErroParametroInvalido('sigla'))
          }
          const estacao = await this.consultaEstacao.consultar(parametro.toLowerCase())
          return resposta(estacao)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
