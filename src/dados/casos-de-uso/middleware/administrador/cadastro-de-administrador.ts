import { CadastroAdministrador } from '../../../../dominio/casos-de-uso/middleware/administrador/cadastro-de-adminstrador'
import { RepositorioFuncionario } from '../../../protocolos/bd/funcionario/repositorio-funcionario'
import { GeradorDeHash } from '../../../protocolos/criptografia/gerador-de-hash'

export class CadastroAdministradorBD implements CadastroAdministrador {
  constructor (
    private readonly geradorDeHash: GeradorDeHash,
    private readonly repositorioCadastroFuncionario: RepositorioFuncionario
  ) {}

  async cadastrar (senha: string, email: string): Promise<string> {
    const senhaHashed = await this.geradorDeHash.gerar(senha)
    const contaAdministrador = {
      nome: 'admin',
      email: email,
      senha: senhaHashed,
      administrador: 'true',
      areaId: '9'
    }
    await this.repositorioCadastroFuncionario.adicionar(contaAdministrador)
    return await Promise.resolve('')
  }
}
