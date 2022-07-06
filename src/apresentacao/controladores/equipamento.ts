import { erroDeServidor, requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroDeEquipamento } from '../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ConsultaEquipamento } from '../../dominio/casos-de-uso/equipamento/consulta-equipamento'

export class ControladorDeEquipamento implements Controlador {
  constructor (
    private readonly cadastroDeEquipamento: CadastroDeEquipamento,
    private readonly consultaEquipamento: ConsultaEquipamento
  ) {}

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    const parametro = requisicaoHttp.parametro
    switch (metodo) {
      case 'GET':
      {
        if (!parametro) { // eslint-disable-line
          const todosEquipamentos = await this.consultaEquipamento.consultarTodos()
          return resposta(todosEquipamentos)
        }
        await this.consultaEquipamento.consultar(+parametro)
        return await new Promise(resolve => resolve(resposta('')))
      }
      case 'POST':
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
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
