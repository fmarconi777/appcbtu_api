import { RepositorioCadastroTelefone } from '../../../../dados/protocolos/bd/telefone/repositorio-cadastro-telefone'
import { DadosTelefone } from '../../../../dominio/casos-de-uso/telefone/cadastro-de-telefone'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Telefone } from '../models/modelo-telefone'

export class RepositorioTelefoneMariaDB implements RepositorioCadastroTelefone {
  async inserir (dados: DadosTelefone): Promise<string> {
    AuxiliaresMariaDB.verificaConexao()
    await Telefone.create(dados)
    return 'Telefone cadastrado com sucesso'
  }
}
