import { CadastroAdministrador } from '../../../../dominio/casos-de-uso/middleware/administrador/cadastro-de-adminstrador'
import { GeradorDeHash } from '../../../protocolos/criptografia/gerador-de-hash'

export class CadastroAdministradorBD implements CadastroAdministrador {
  constructor (
    private readonly geradorDeHash: GeradorDeHash
  ) {}

  async cadastrar (senha: string, email: string): Promise<string> {
    await this.geradorDeHash.gerar(senha)
    return await Promise.resolve('')
  }
}
