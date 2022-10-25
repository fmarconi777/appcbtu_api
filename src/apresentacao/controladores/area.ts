import { Controlador } from '@/apresentacao/protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '@/apresentacao/protocolos/http'
import { resposta, requisicaoNaoEncontrada, erroDeServidor, requisicaoImpropria } from '@/apresentacao/auxiliares/auxiliar-http'
import { ErroParametroInvalido } from '@/apresentacao/erros/erro-parametro-invalido'
import { ErroMetodoInvalido } from '@/apresentacao/erros/erro-metodo-invalido'
import { ConsultaArea } from '@/dominio/casos-de-uso/area/consulta-area'
import { ErroFaltaParametro } from '@/apresentacao/erros/erro-falta-parametro'
import { CadastroArea } from '@/dominio/casos-de-uso/area/cadastro-de-area'
import { DeletaArea } from '@/dominio/casos-de-uso/area/deleta-area'
import { AlteraArea } from '@/dominio/casos-de-uso/area/altera-area'

export class ControladorDeArea implements Controlador {
  constructor (
    private readonly consultaArea: ConsultaArea,
    private readonly cadastroDeArea: CadastroArea,
    private readonly deletaArea: DeletaArea,
    private readonly alteraArea: AlteraArea
  ) {}

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    const parametro = requisicaoHttp.parametro
    switch (metodo) {
      case 'GET':
        try {
          if (!parametro) { // eslint-disable-line
            const todasAreas = await this.consultaArea.consultarTodas()
            return resposta(todasAreas)
          }
          const area = await this.consultaArea.consultar(parametro.toUpperCase())
          if (!area) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('área'))
          }
          return resposta(area)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'POST':
        try {
          const nome = requisicaoHttp.corpo.nome
          const id = requisicaoHttp.corpo.id
          if (!nome || nome === 'undefined') { // eslint-disable-line
            return requisicaoImpropria(new ErroFaltaParametro('nome'))
          }
          if (!id || !Number.isInteger(+id) || +id !== Math.abs(+id)) { // eslint-disable-line
            return requisicaoImpropria(new ErroFaltaParametro('id'))
          }
          const area = await this.cadastroDeArea.inserir(requisicaoHttp.corpo.nome.toUpperCase(), +id)
          return resposta(area)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'DELETE':
        try {
          const area = await this.deletaArea.deletar(parametro.toUpperCase())
          if (!area) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('área'))
          }
          return resposta(area)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'PATCH':
        try {
          const nome = requisicaoHttp.corpo.nome
          if (!nome || nome === 'undefined') { // eslint-disable-line
            return requisicaoImpropria(new ErroFaltaParametro('nome'))
          }
          const area = await this.alteraArea.alterar(nome.toUpperCase(), parametro.toUpperCase())
          if (!area) { // eslint-disable-line
            return requisicaoNaoEncontrada(new ErroParametroInvalido('área'))
          }
          return resposta(area)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
