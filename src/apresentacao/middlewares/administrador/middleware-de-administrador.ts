import { Administrador } from '../../protocolos/administrador'
import { CadastroAdministrador } from '../../../dominio/casos-de-uso/middleware/administrador/cadastro-de-adminstrador'
import { ConsultaAdministrador } from '../../../dominio/casos-de-uso/middleware/administrador/consulta-administrador'
import { Validador } from '../../protocolos/validador'
import { LeitorDeTerminal } from '../../../dominio/casos-de-uso/middleware/terminal/leitor-de-terminal'
import { LeitorDeSenhaTerminal } from '../../../dominio/casos-de-uso/middleware/terminal/leitor-de-senha-terminal'

export class MiddlewareDeAdministrador implements Administrador {
  constructor (
    private readonly consultaAdministrador: ConsultaAdministrador,
    private readonly capturaEmailNoTerminal: LeitorDeTerminal,
    private readonly capturaSenhaNoTerminal: LeitorDeSenhaTerminal,
    private readonly validadorDeEmail: Validador,
    private readonly cadastroAdministrador: CadastroAdministrador
  ) {}

  async tratarInput (): Promise<void> {
    try {
      if (!await this.consultaAdministrador.consultar()) {
        const email = this.capturaEmailNoTerminal.perguntarEmail('Insira um e-mail (ex: admin@admin.com.br) para a conta admin: ')

        if (this.validadorDeEmail.validar(email)) {
          const senha = this.capturaSenhaNoTerminal.perguntarSenha('Insira uma senha para a conta admin: ')
          console.log(await this.cadastroAdministrador.cadastrar(senha, email))
          return
        }
        console.log()
        console.log('E-mail inválido!')
        console.log('Conta admin não foi cadastrada!')
        console.log()
        process.exitCode = 0
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
