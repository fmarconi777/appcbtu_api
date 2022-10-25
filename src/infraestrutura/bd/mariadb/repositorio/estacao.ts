import { RepositorioEstacao, ModelosEstacoes } from '@/dados/protocolos/bd/estacao/repositorio-estacao'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Estacao } from '@/infraestrutura/bd/mariadb/models/modelo-estacao'

export class RepositorioEstacaoMariaDB implements RepositorioEstacao {
  async consultar (sigla?: string): Promise<ModelosEstacoes> {
    AuxiliaresMariaDB.verificaConexao()
    if (!sigla) { // eslint-disable-line 
      return await Estacao.findAll()
    }
    return await Estacao.findOne({ where: { sigla: sigla } })
  }
}
