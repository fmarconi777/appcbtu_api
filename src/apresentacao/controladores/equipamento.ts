import { erroDeServidor, requisicaoImpropria, requisicaoNaoEncontrada, resposta } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroDeEquipamento } from '../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ConsultaEquipamento } from '../../dominio/casos-de-uso/equipamento/consulta-equipamento'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ValidadorBD } from '../protocolos/validadorBD'
import { AlteraCadastroDeEquipamento } from '../../dominio/casos-de-uso/equipamento/altera-cadastro-de-equipamento'

export class ControladorDeEquipamento implements Controlador {
  constructor (
    private readonly cadastroDeEquipamento: CadastroDeEquipamento,
    private readonly consultaEquipamento: ConsultaEquipamento,
    private readonly validaEstacao: ValidadorBD,
    private readonly alteraCadastroDeEquipamento: AlteraCadastroDeEquipamento
  ) {}

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    const parametro = requisicaoHttp.parametro
    switch (metodo) {
      case 'GET':
        try {
          if (!parametro) { // eslint-disable-line
            const todosEquipamentos = await this.consultaEquipamento.consultarTodos()
            return resposta(todosEquipamentos)
          }
          if (!Number.isInteger(+parametro) || +parametro !== Math.abs(+parametro)) {
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          const equipamento = await this.consultaEquipamento.consultar(+parametro)
          return resposta(equipamento)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'POST':
        try {
          const camposRequeridos = ['nome', 'tipo', 'estado', 'estacaoId']
          for (const campo of camposRequeridos) {
            if(!requisicaoHttp.corpo[campo]) { // eslint-disable-line
              return requisicaoImpropria(new ErroFaltaParametro(campo))
            }
          }
          const estacaoValida = await this.validaEstacao.validar(+requisicaoHttp.corpo.estacaoId)
          if (!estacaoValida) {
            return requisicaoNaoEncontrada(new ErroParametroInvalido('estacaoId'))
          }
          const equipamento = await this.cadastroDeEquipamento.inserir(requisicaoHttp.corpo)
          return resposta(equipamento)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'PUT':
        try {
          const camposRequeridos = ['nome', 'tipo', 'estado', 'estacaoId']
          for (const campo of camposRequeridos) {
            if(!requisicaoHttp.corpo[campo]) { // eslint-disable-line
              return requisicaoImpropria(new ErroFaltaParametro(campo))
            }
          }
          const estacaoValida = await this.validaEstacao.validar(+requisicaoHttp.corpo.estacaoId)
          if (!estacaoValida) {
            return requisicaoNaoEncontrada(new ErroParametroInvalido('estacaoId'))
          }
          await this.alteraCadastroDeEquipamento.alterar(requisicaoHttp.corpo)
          return await new Promise(resolve => resolve(resposta('')))
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
