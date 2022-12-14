import { CadastroAdministrador } from '@/dominio/casos-de-uso/middleware/administrador/cadastro-de-adminstrador'
import { RepositorioFuncionario } from '@/dados/protocolos/bd/funcionario/repositorio-funcionario'
import { GeradorDeHash } from '@/dados/protocolos/criptografia/gerador-de-hash'

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
    if (await this.repositorioCadastroFuncionario.adicionar(contaAdministrador)) { // eslint-disable-line
      return 'Conta admin cadastrada com sucesso'
    }
    return 'Erro ao cadastrar a conta admin'
  }
}
