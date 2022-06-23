import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { resposta, requisicaoNaoEncontrada, erroDeServidor, requisicaoImpropria } from '../auxiliares/auxiliar-http'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { Validador } from '../protocolos/validador'
import { ConsultaArea } from '../../dominio/casos-de-uso/area/consulta-area'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroArea } from '../../dominio/casos-de-uso/area/cadastro-de-area'

export class ControladorDeArea implements Controlador {
  constructor (
    private readonly consultaArea: ConsultaArea,
    private readonly validaArea: Validador,
    private readonly cadastroDeArea: CadastroArea
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
          const areaValida = this.validaArea.validar(parametro.toUpperCase())
          if (!areaValida) {
            return requisicaoNaoEncontrada(new ErroParametroInvalido('área'))
          }
          const area = await this.consultaArea.consultar(parametro)
          return resposta(area)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'POST':
        try {
          const nome = requisicaoHttp.corpo.nome
          if (!nome || nome === 'undefined') { // eslint-disable-line
            return requisicaoImpropria(new ErroFaltaParametro('nome'))
          }
          const area = await this.cadastroDeArea.inserir(requisicaoHttp.corpo.nome.toUpperCase())
          return resposta(area)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      case 'DELETE':
      {
        if (!parametro) { // eslint-disable-line
          return requisicaoImpropria(new ErroFaltaParametro('área'))
        }
        return await new Promise((resolve) => resolve({ status: 200, corpo: 'Deletado com sucesso' }))
      }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
