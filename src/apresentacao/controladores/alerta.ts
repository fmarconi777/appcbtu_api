import { erroDeServidor, requisicaoImpropria, resposta, requisicaoNaoEncontrada } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroAlerta } from '../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ConsultaAlerta } from '../../dominio/casos-de-uso/alerta/consulta-alerta'

export class ControladorDeAlerta implements Controlador {
  private readonly cadastroDeAlerta: CadastroAlerta
  private readonly consultaAlerta: ConsultaAlerta

  constructor (cadastroDeAlerta: CadastroAlerta, consultaAlerta: ConsultaAlerta) {
    this.cadastroDeAlerta = cadastroDeAlerta
    this.consultaAlerta = consultaAlerta
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
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
          const parametro = requisicaoHttp.parametro
          if (!parametro) {// eslint-disable-line
            const todosAlertas = await this.consultaAlerta.consultaalertaTodas()
            return resposta(todosAlertas)
          }
          const alerta = await this.consultaAlerta.consultaalerta(parametro)
          if (!alerta || !Number.isInteger(+parametro) || +parametro !== Math.abs(+parametro)) { // eslint-disable-line
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
