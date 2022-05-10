import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { erroDeServidor, requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { Validador } from '../protocolos/validador'
export class ControladorDeFuncionario implements Controlador {
  private readonly validadorDeEmail: Validador
  constructor (validadorDeEmail: Validador) {
    this.validadorDeEmail = validadorDeEmail
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    try {
      const camposRequeridos = ['nome', 'email', 'area', 'senha', 'confirmarSenha']
      for (const campo of camposRequeridos) {
      if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
          return requisicaoImpropria(new ErroParametroInvalido(campo))
        }
      }
      const { email, senha, confirmarSenha } = requisicaoHttp.corpo
      if (senha !== confirmarSenha) {
        return requisicaoImpropria(new ErroParametroInvalido('confirmarSenha'))
      }
      const validar = this.validadorDeEmail.validar(email)
      if (!validar) {
        return requisicaoImpropria(new ErroParametroInvalido('email'))
      }
      return resposta('retornou')
    } catch (erro) {
      return erroDeServidor()
    }
  }
}
