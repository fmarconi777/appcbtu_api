import { Administrador } from '../../protocolos/administrador'
import { CadastroAdministrador } from '../../../dominio/casos-de-uso/middleware/administrador/cadastro-de-adminstrador'
import { ConsultaAdministrador } from '../../../dominio/casos-de-uso/middleware/administrador/consulta-administrador'
import { Validador } from '../../protocolos/validador'
import { LeitorDeTerminal } from '../../../dominio/casos-de-uso/middleware/terminal/leitor-de-terminal'
import { LeitorDeSenhaTerminal } from '../../../dominio/casos-de-uso/middleware/terminal/leitor-de-senha-terminal'

export class MiddlewareDeAdministrador implements Administrador {
  constructor (
    private readonly consultaAdministrador: ConsultaAdministrador,
    private readonly capturaInputNoTerminal: LeitorDeTerminal,
    private readonly capturaSenhaNoTerminal: LeitorDeSenhaTerminal,
    private readonly validadorDeEmail: Validador,
    private readonly cadastroAdministrador: CadastroAdministrador
  ) {}

  async tratarInput (): Promise<void> {
    try {
      if (!await this.consultaAdministrador.consultar()) {
        const email = this.capturaInputNoTerminal.perguntar('Insira um e-mail (ex: admin@admin.com.br) para a conta admin: ')
        const senha = this.capturaSenhaNoTerminal.perguntarSenha('Insira uma senha para a conta admin: ')

        if (senha && email) { // eslint-disable-line
          if (this.validadorDeEmail.validar(email)) {
            console.log(await this.cadastroAdministrador.cadastrar(senha, email))
            return
          }
          console.log('E-mail inválido!')
          console.log()
          console.log('Execução finalizada')
          process.exitCode = 0
        }
      }
      return
    } catch (erro: any) {
      console.error(erro)
    }
  }

  public criarAdmin (): void {
    this.tratarInput().catch(erro => console.error(erro))
  }
}
