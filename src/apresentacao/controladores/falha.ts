import { CadastroDeFalha } from '../../dominio/casos-de-uso/falha/cadastro-de-falha'
import { ConsultaFalha } from '../../dominio/casos-de-uso/falha/consulta-falha'
import { erroDeServidor, requisicaoImpropria, requisicaoNaoEncontrada, resposta } from '../auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'

export class ControladorDeFalha implements Controlador {
  constructor (
    private readonly cadastroDeFalha: CadastroDeFalha,
    private readonly consultaFalha: ConsultaFalha
  ) {}

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    const parametro = requisicaoHttp.parametro
    switch (metodo) {
      case 'POST':
        try {
          const camposRequeridos = ['numFalha', 'equipamentoId']
          for (const campo of camposRequeridos) {
            if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
              return requisicaoImpropria(new ErroFaltaParametro(campo))
            }
          }
          const falha = await this.cadastroDeFalha.inserir(requisicaoHttp.corpo)
          if (!falha) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('equipamentoId'))
          }
          return resposta(falha)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'GET':
        try {
          if (!parametro) { // eslint-disable-line
            const falhas = await this.consultaFalha.consultarTodas()
            return resposta(falhas)
          }
          if (!Number.isInteger(+parametro) || +parametro !== Math.abs(+parametro)) {
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          const falha = await this.consultaFalha.consultar(+parametro)
          if (!falha) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          return resposta(falha)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
