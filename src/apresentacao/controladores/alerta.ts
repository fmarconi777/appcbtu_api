import { CadastroAlerta } from '@/dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ConsultaAlerta } from '@/dominio/casos-de-uso/alerta/consulta-alerta'
import { AlteraAlerta } from '@/dominio/casos-de-uso/alerta/altera-alerta'
import { DeletaAlerta } from '@/dominio/casos-de-uso/alerta/deleta-alerta'
import { erroDeServidor, requisicaoImpropria, resposta, requisicaoNaoEncontrada } from '@/apresentacao/auxiliares/auxiliar-http'
import { Controlador } from '@/apresentacao/protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '@/apresentacao/protocolos/http'
import { ErroFaltaParametro } from '@/apresentacao/erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '@/apresentacao/erros/erro-metodo-invalido'
import { ErroParametroInvalido } from '@/apresentacao/erros/erro-parametro-invalido'
import { Validador } from '@/apresentacao/protocolos/validador'

export class ControladorDeAlerta implements Controlador {
  constructor (
    private readonly cadastroDeAlerta: CadastroAlerta,
    private readonly consultaAlerta: ConsultaAlerta,
    private readonly validadorDeSigla: Validador,
    private readonly alteraAlerta: AlteraAlerta,
    private readonly deletaAlerta: DeletaAlerta
  ) {}

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    const parametro = requisicaoHttp.parametro
    const parametro2 = requisicaoHttp.parametro2
    switch (metodo) {
      case 'POST':
        try {
          const camposRequeridos = ['descricao', 'prioridade', 'dataInicio', 'dataFim', 'ativo', 'estacaoId']
          for (const campo of camposRequeridos) {
            if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
              return requisicaoImpropria(new ErroFaltaParametro(campo))
            }
          }
          const alerta = await this.cadastroDeAlerta.inserir(requisicaoHttp.corpo)
          if (!alerta) {  // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('estacaoId'))
          }
          return resposta(alerta)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'GET':
        try {
          if (!parametro) {// eslint-disable-line
            const todosAlertas = await this.consultaAlerta.consultarTodas()
            return resposta(todosAlertas)
          }
          const parametroValido = this.validadorDeSigla.validar(parametro.toLowerCase())
          if (!parametroValido) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('sigla'))
          }
          if (parametro2 && (+parametro2 !== Math.abs(+parametro2) || !Number.isInteger(+parametro2))) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          const alerta = await this.consultaAlerta.consultar(parametro.toLowerCase(), parametro2)
          if (!alerta) {  // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          return resposta(alerta)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'PATCH':
        try {
          if (!Number.isInteger(+parametro) || +parametro !== Math.abs(+parametro)) {
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          const camposRequeridos = ['descricao', 'prioridade', 'dataInicio', 'dataFim', 'estacaoId']
          for (const campo of camposRequeridos) {
            if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
              return requisicaoImpropria(new ErroFaltaParametro(campo))
            }
          }
          const dados = Object.assign({}, { id: parametro }, requisicaoHttp.corpo)
          const alerta = await this.alteraAlerta.alterar(dados)
          if (!alerta.valido) {  // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido(alerta.resposta))
          }
          return resposta(alerta.resposta)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'DELETE':
        try {
          if (!Number.isInteger(+parametro) || +parametro !== Math.abs(+parametro)) {
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          const alerta = await this.deletaAlerta.deletar(+parametro)
          if (!alerta) {  // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          return resposta(alerta)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
