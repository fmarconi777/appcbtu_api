import { CadastroDeTelefone } from '../../dominio/casos-de-uso/telefone/cadastro-de-telefone'
import { erroDeServidor, requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'

export class ControladorDeTelefone implements Controlador {
  constructor (
    private readonly cadastroDeTelefone: CadastroDeTelefone
  ) {}

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    switch (metodo) {
      case 'POST':
        try {
          const camposRequeridos = ['numero', 'estacaoId']
          for (const campo of camposRequeridos) {
            if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
              return requisicaoImpropria(new ErroFaltaParametro(campo))
            }
          }
          const dados = {
            numero: +requisicaoHttp.corpo.numero,
            estacaoId: +requisicaoHttp.corpo.estacaoId
          }
          if (!Number.isInteger(dados.numero) || dados.numero !== Math.abs(dados.numero)) {
            return requisicaoImpropria(new ErroParametroInvalido('numero'))
          }
          const telefone = await this.cadastroDeTelefone.inserir(dados)
          if (!telefone) { // eslint-disable-line
            return requisicaoImpropria(new ErroParametroInvalido('estacaoId'))
          }
          return resposta(telefone)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
