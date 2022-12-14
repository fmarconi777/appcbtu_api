import { CadastroDeEquipamento } from '@/dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ConsultaEquipamento } from '@/dominio/casos-de-uso/equipamento/consulta-equipamento'
import { AlteraCadastroDeEquipamento } from '@/dominio/casos-de-uso/equipamento/altera-cadastro-de-equipamento'
import { AlteraEstadoDeEquipamento } from '@/dominio/casos-de-uso/equipamento/altera-estado-de-equipamento'
import { DeletaEquipamento } from '@/dominio/casos-de-uso/equipamento/deleta-equipamento'
import { erroDeServidor, requisicaoImpropria, requisicaoNaoEncontrada, resposta } from '@/apresentacao/auxiliares/auxiliar-http'
import { Controlador } from '@/apresentacao/protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '@/apresentacao/protocolos/http'
import { ErroFaltaParametro } from '@/apresentacao/erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '@/apresentacao/erros/erro-metodo-invalido'
import { ErroParametroInvalido } from '@/apresentacao/erros/erro-parametro-invalido'

export class ControladorDeEquipamento implements Controlador {
  constructor (
    private readonly cadastroDeEquipamento: CadastroDeEquipamento,
    private readonly consultaEquipamento: ConsultaEquipamento,
    private readonly alteraCadastroDeEquipamento: AlteraCadastroDeEquipamento,
    private readonly alteraEstadoDeEquipamento: AlteraEstadoDeEquipamento,
    private readonly deletaEquipamento: DeletaEquipamento
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
          if (+parametro !== Math.abs(+parametro) || !Number.isInteger(+parametro)) {
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
          if (+parametro !== Math.abs(+parametro) || !Number.isInteger(+parametro)) {
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
          if (+parametro !== Math.abs(+parametro) || !Number.isInteger(+parametro)) {
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
      case 'DELETE':
        try {
          if (+parametro !== Math.abs(+parametro) || !Number.isInteger(+parametro)) {
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          const equipamentoDeletado = await this.deletaEquipamento.deletar(+parametro)
          if (!equipamentoDeletado) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
          }
          return resposta(equipamentoDeletado)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
