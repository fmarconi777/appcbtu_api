import { erroDeServidor, requisicaoImpropria, requisicaoNaoEncontrada, resposta } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroDeEquipamento } from '../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ConsultaEquipamento } from '../../dominio/casos-de-uso/equipamento/consulta-equipamento'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { AlteraCadastroDeEquipamento } from '../../dominio/casos-de-uso/equipamento/altera-cadastro-de-equipamento'

export class ControladorDeEquipamento implements Controlador {
  constructor (
    private readonly cadastroDeEquipamento: CadastroDeEquipamento,
    private readonly consultaEquipamento: ConsultaEquipamento,
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
          const equipamento = await this.alteraCadastroDeEquipamento.alterar(dados)
          if (equipamento.invalido) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido(equipamento.parametro))
          }
          return resposta(equipamento.cadastro)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'PATCH':
        if (!requisicaoHttp.corpo.tipo) { // eslint-disable-line
          return requisicaoImpropria(new ErroFaltaParametro('tipo'))
        }
        if (!Number.isInteger(+parametro) || +parametro !== Math.abs(+parametro)) {
          return requisicaoNaoEncontrada(new ErroParametroInvalido('id'))
        }
        return resposta('')
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
