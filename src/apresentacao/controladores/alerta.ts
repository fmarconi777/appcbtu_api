import { erroDeServidor, requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroAlerta } from '../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'

export class ControladorDeAlerta implements Controlador {
  private readonly cadastroDeAlerta: CadastroAlerta

  constructor (cadastroDeAlerta: CadastroAlerta) {
    this.cadastroDeAlerta = cadastroDeAlerta
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
          return resposta(alerta)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
