import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { erroDeServidor, requisicaoImpropria, resposta } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { Validador } from '../protocolos/validador'
import { CadastroDeFuncionario } from '../../dominio/casos-de-uso/funcionario/cadastro-de-funcionario'
export class ControladorDeFuncionario implements Controlador {
  private readonly validadorDeEmail: Validador
  private readonly cadastrodeFuncionario: CadastroDeFuncionario
  constructor (validadorDeEmail: Validador, CadastroDeFuncionario: CadastroDeFuncionario) {
    this.validadorDeEmail = validadorDeEmail
    this.cadastrodeFuncionario = CadastroDeFuncionario
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    try {
      const camposRequeridos = ['nome', 'email', 'senha', 'administrador', 'areaId', 'confirmarSenha']
      for (const campo of camposRequeridos) {
      if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
          return requisicaoImpropria(new ErroParametroInvalido(campo))
        }
      }
      const { nome, email, senha, administrador, areaId, confirmarSenha } = requisicaoHttp.corpo
      if (senha !== confirmarSenha) {
        return requisicaoImpropria(new ErroParametroInvalido('confirmarSenha'))
      }
      const validar = this.validadorDeEmail.validar(email)
      if (!validar) {
        return requisicaoImpropria(new ErroParametroInvalido('email'))
      }
      const conta = await this.cadastrodeFuncionario.adicionar({
        nome,
        email,
        senha,
        administrador,
        areaId
      })
      return resposta(conta)
    } catch (erro: any) {
      return erroDeServidor(erro)
    }
  }
}
