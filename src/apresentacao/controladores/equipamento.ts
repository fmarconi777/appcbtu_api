import { erroDeServidor, requisicaoImpropria, requisicaoNaoEncontrada, resposta } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroDeEquipamento } from '../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ConsultaEquipamento } from '../../dominio/casos-de-uso/equipamento/consulta-equipamento'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { AlteraCadastroDeEquipamento } from '../../dominio/casos-de-uso/equipamento/altera-cadastro-de-equipamento'
import { AlteraEstadoDeEquipamento } from '../../dominio/casos-de-uso/equipamento/altera-estado-de-equipamento'

export class ControladorDeEquipamento implements Controlador {
  constructor (
    private readonly cadastroDeEquipamento: CadastroDeEquipamento,
    private readonly consultaEquipamento: ConsultaEquipamento,
    private readonly alteraCadastroDeEquipamento: AlteraCadastroDeEquipamento,
    private readonly alteraEstadoDeEquipamento: AlteraEstadoDeEquipamento
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
          if (!equipamento) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          return resposta(equipamento)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'POST':
        try {
          const camposRequeridos = ['nome', 'tipo', 'estado', 'estacaoId']
          for (const campo of camposRequeridos) {
            if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
              return requisicaoImpropria(new ErroFaltaParametro(campo))
            }
          }
          const equipamento = await this.cadastroDeEquipamento.inserir(requisicaoHttp.corpo)
          if (!equipamento) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('estacaoId'))
          }
          return resposta(equipamento)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'PUT':
        try {
          const camposRequeridos = ['nome', 'tipo', 'estado', 'estacaoId']
          for (const campo of camposRequeridos) {
            if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
              return requisicaoImpropria(new ErroFaltaParametro(campo))
            }
          }
          if (!Number.isInteger(+parametro) || +parametro !== Math.abs(+parametro)) {
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          const dados = Object.assign({}, { id: parametro }, requisicaoHttp.corpo)
          const equipamentoAlterado = await this.alteraCadastroDeEquipamento.alterar(dados)
          if (equipamentoAlterado.invalido) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido(equipamentoAlterado.parametro))
          }
          return resposta(equipamentoAlterado.cadastro)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'PATCH':
        try {
          if (!requisicaoHttp.corpo.estado) { // eslint-disable-line
            return requisicaoImpropria(new ErroFaltaParametro('estado'))
          }
          if (!Number.isInteger(+parametro) || +parametro !== Math.abs(+parametro)) {
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          const dados = Object.assign({}, { id: parametro }, requisicaoHttp.corpo)
          const equipamentoAlterado = await this.alteraEstadoDeEquipamento.alterar(dados)
          if (!equipamentoAlterado) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          return resposta(equipamentoAlterado)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
