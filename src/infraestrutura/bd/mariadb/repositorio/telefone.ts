import { RepositorioCadastroTelefone } from '@/dados/protocolos/bd/telefone/repositorio-cadastro-telefone'
import { DadosTelefone } from '@/dominio/casos-de-uso/telefone/cadastro-de-telefone'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Telefone } from '@/infraestrutura/sequelize/models/modelo-telefone'

export class RepositorioTelefoneMariaDB implements RepositorioCadastroTelefone {
  async inserir (dados: DadosTelefone): Promise<string> {
    await AuxiliaresMariaDB.verificaConexao()
    await Telefone.create(dados)
    return 'Telefone cadastrado com sucesso'
  }
}
