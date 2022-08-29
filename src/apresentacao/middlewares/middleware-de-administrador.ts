import { Administrador } from '../protocolos/administrador'
import ReadLine from 'node:readline'
import { CadastroAdministrador } from '../../dominio/casos-de-uso/middleware/cadastro-de-adminstrador'
import { ConsultaAdministrador } from '../../dominio/casos-de-uso/middleware/consulta-administrador'

export class MiddlewareDeAdministrador implements Administrador {
  constructor (
    private readonly consultaAdministrador: ConsultaAdministrador,
    private readonly cadastroAdministrador: CadastroAdministrador
  ) {}

  async tratarInput (): Promise<void> {
    try {
      if (!await this.consultaAdministrador.consultar()) {
        const leitor = ReadLine.createInterface({
          input: process.stdin,
          output: process.stdout
        })
        let senha: string = ''

        leitor.question('Insira uma senha para a conta admin: ', (input) => {
          senha = input
          leitor.close()
        })

        console.log(await this.cadastroAdministrador.cadastrar(senha))
        console.log('Conta admin cadastrada com sucesso')
      }
    } catch (erro: any) {
      console.error(erro)
    }
  }
}
