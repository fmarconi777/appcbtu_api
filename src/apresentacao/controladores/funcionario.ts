import { CadastroDeFuncionario } from '@/dominio/casos-de-uso/funcionario/cadastro-de-funcionario'
import { ErroParametroInvalido } from '@/apresentacao/erros/erro-parametro-invalido'
import { RequisicaoHttp, RespostaHttp } from '@/apresentacao/protocolos/http'
import { erroDeServidor, requisicaoImpropria, requisicaoNegada, resposta } from '@/apresentacao/auxiliares/auxiliar-http'
import { Controlador } from '@/apresentacao/protocolos/controlador'
import { Validador } from '@/apresentacao/protocolos/validador'
import { ErroMetodoInvalido } from '@/apresentacao/erros/erro-metodo-invalido'
import { ErroEmailEmUso } from '@/apresentacao/erros/erro-parametro-email-em-uso'

export class ControladorDeFuncionario implements Controlador {
  private readonly validadorDeEmail: Validador
  private readonly cadastrodeFuncionario: CadastroDeFuncionario

  constructor (validadorDeEmail: Validador, CadastroDeFuncionario: CadastroDeFuncionario) {
    this.validadorDeEmail = validadorDeEmail
    this.cadastrodeFuncionario = CadastroDeFuncionario
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    switch (metodo) {
      case 'POST':
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
          if (!conta) { // eslint-disable-line
            return requisicaoNegada(new ErroEmailEmUso())
          }
          return resposta(conta)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
