import { erroDeServidor, requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroAlerta } from '../../dominio/casos-de-uso/alerta/cadastro-de-alerta'

export class ControladorDeAlerta implements Controlador {
  private readonly cadastroDeAlerta: CadastroAlerta

  constructor (cadastroDeEquipamento: CadastroAlerta) {
    this.cadastroDeAlerta = cadastroDeEquipamento
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    try {
      const camposRequeridos = ['descricao', 'prioridade', 'dataInicio', 'dataFim', 'ativo', 'estacaoId']
      for (const campo of camposRequeridos) {
         if(!requisicaoHttp.corpo[campo]) { // eslint-disable-line
          return requisicaoImpropria(new ErroFaltaParametro(campo))
        }
      }
      const alerta = await this.cadastroDeAlerta.inserir(requisicaoHttp.corpo)
      return resposta(alerta)
    } catch (erro: any) {
      return erroDeServidor(erro)
    }
  }
}
