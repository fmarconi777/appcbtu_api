import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { erroDeServidor, requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { Validador } from '../protocolos/validador'
import { AdicionarConta } from '../../dominio/casos-de-uso/adicionarconta/cadastro-de-funcionario'
export class ControladorDeFuncionario implements Controlador {
  private readonly validadorDeEmail: Validador
  private readonly adicionarConta: AdicionarConta
  constructor (validadorDeEmail: Validador, adicionarConta: AdicionarConta) {
    this.validadorDeEmail = validadorDeEmail
    this.adicionarConta = adicionarConta
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    try {
      const camposRequeridos = ['nome', 'email', 'area', 'senha', 'confirmarSenha']
      for (const campo of camposRequeridos) {
      if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
          return requisicaoImpropria(new ErroParametroInvalido(campo))
        }
      }
      const { nome, email, area, senha, confirmarSenha } = requisicaoHttp.corpo
      if (senha !== confirmarSenha) {
        return requisicaoImpropria(new ErroParametroInvalido('confirmarSenha'))
      }
      const validar = this.validadorDeEmail.validar(email)
      if (!validar) {
        return requisicaoImpropria(new ErroParametroInvalido('email'))
      }
      const conta = await this.adicionarConta.adicionar({
        nome,
        email,
        area,
        senha,
        confirmarSenha
      })
      return resposta(conta)
    } catch (erro) {
      return erroDeServidor()
    }
  }
}
