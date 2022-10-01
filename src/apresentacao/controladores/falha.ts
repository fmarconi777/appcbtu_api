import { AlteraFalha } from '../../dominio/casos-de-uso/falha/altera-falha'
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
    private readonly consultaFalha: ConsultaFalha,
    private readonly alteraFalha: AlteraFalha
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
          const data = new Date(Date.now() - 10800000).toISOString()
          const dataCriacao = (data.substring(0, 19) + 'Z')
          const dadosfalha = Object.assign({}, requisicaoHttp.corpo, { dataCriacao })
          const falha = await this.cadastroDeFalha.inserir(dadosfalha)
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
      case 'PATCH':
        try {
          const camposRequeridos = ['numFalha', 'equipamentoId']
          for (const campo of camposRequeridos) {
            if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
              return requisicaoImpropria(new ErroFaltaParametro(campo))
            }
          }
          if (!Number.isInteger(+parametro) || +parametro !== Math.abs(+parametro)) {
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          const dados = {
            id: +parametro,
            numFalha: +requisicaoHttp.corpo.numFalha,
            equipamentoId: +requisicaoHttp.corpo.equipamentoId
          }
          await this.alteraFalha.alterar(dados)
          return resposta('')
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
