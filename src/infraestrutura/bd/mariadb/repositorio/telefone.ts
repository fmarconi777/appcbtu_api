import { RepositorioCadastroTelefone } from '@/dados/protocolos/bd/telefone/repositorio-cadastro-telefone'
import { DadosTelefone } from '@/dominio/casos-de-uso/telefone/cadastro-de-telefone'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Telefone } from '@/infraestrutura/bd/mariadb/models/modelo-telefone'

export class RepositorioTelefoneMariaDB implements RepositorioCadastroTelefone {
  async inserir (dados: DadosTelefone): Promise<string> {
    AuxiliaresMariaDB.verificaConexao()
    await Telefone.create(dados)
    return 'Telefone cadastrado com sucesso'
  }
}
