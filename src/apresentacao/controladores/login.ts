import { Autenticador } from '../../dominio/casos-de-uso/autenticador/autenticador'
import { erroDeServidor, requisicaoImpropria, requisicaoNaoAutorizada, resposta } from '../auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ErroDeAutorizacao } from '../erros/erro-nao-autorizado'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { Validador } from '../protocolos/validador'

export class ControladorDeLogin implements Controlador {
  private readonly validadorDeEmail: Validador
  private readonly autenticador: Autenticador

  constructor (validadorDeEmail: Validador, autenticador: Autenticador) {
    this.validadorDeEmail = validadorDeEmail
    this.autenticador = autenticador
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    switch (metodo) {
      case 'POST':
        try {
          const camposRequeridos = ['email', 'senha']
          for (const campo of camposRequeridos) {
            if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
              return requisicaoImpropria(new ErroFaltaParametro(campo))
            }
          }
          const { email, senha } = requisicaoHttp.corpo
          const validar = this.validadorDeEmail.validar(email)
          if (!validar) {
            return requisicaoImpropria(new ErroParametroInvalido('email'))
          }
          const tokenDeAcesso = await this.autenticador.autenticar({ email, senha })
          if (!tokenDeAcesso) { // eslint-disable-line
            return requisicaoNaoAutorizada(new ErroDeAutorizacao())
          }
          return resposta({ tokenDeAcesso })
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
