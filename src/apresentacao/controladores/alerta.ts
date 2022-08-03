import { erroDeServidor, requisicaoImpropria, resposta, requisicaoNaoEncontrada } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroAlerta } from '../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ConsultaAlerta } from '../../dominio/casos-de-uso/alerta/consulta-alerta'
import { Validador } from '../protocolos/validador'

export class ControladorDeAlerta implements Controlador {
  constructor (
    private readonly cadastroDeAlerta: CadastroAlerta,
    private readonly consultaAlerta: ConsultaAlerta,
    private readonly validadorDeSiglaStub: Validador
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
            const todosAlertas = await this.consultaAlerta.consultaalertaTodas()
            return resposta(todosAlertas)
          }
          const parametroValido = this.validadorDeSiglaStub.validar(parametro)
          if (!parametroValido) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('sigla'))
          }
          if (parametro2 && (+parametro2 !== Math.abs(+parametro2) || !Number.isInteger(+parametro2))) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          const alerta = await this.consultaAlerta.consultaalerta(parametro)
          return resposta(alerta)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
