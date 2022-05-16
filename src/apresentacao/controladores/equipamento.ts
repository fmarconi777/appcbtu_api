import { erroDeServidor, requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroDeEquipamento } from '../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'

export class ControladorDeEquipamento implements Controlador {
  private readonly cadastroDeEquipamento: CadastroDeEquipamento

  constructor (cadastroDeEquipamento: CadastroDeEquipamento) {
    this.cadastroDeEquipamento = cadastroDeEquipamento
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    try {
      const camposRequeridos = ['nome', 'tipo', 'numFalha', 'estado', 'estacaoId']
      for (const campo of camposRequeridos) {
        if(!requisicaoHttp.corpo[campo]) { // eslint-disable-line
          return requisicaoImpropria(new ErroFaltaParametro(campo))
        }
      }
      const equipamento = await this.cadastroDeEquipamento.inserir(requisicaoHttp.corpo)
      return resposta(equipamento)
    } catch (erro: any) {
      return erroDeServidor(erro)
    }
  }
}
