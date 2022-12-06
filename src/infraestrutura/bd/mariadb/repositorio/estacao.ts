import { RepositorioEstacao, ModelosEstacoes } from '@/dados/protocolos/bd/estacao/repositorio-estacao'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Estacao } from '@/infraestrutura//sequelize/models/modelo-estacao'

export class RepositorioEstacaoMariaDB implements RepositorioEstacao {
  async consultar (sigla?: string): Promise<ModelosEstacoes> {
    await AuxiliaresMariaDB.verificaConexao()
    if (!sigla) { // eslint-disable-line 
      return await Estacao.findAll()
    }
    return await Estacao.findOne({ where: { sigla: sigla } })
  }
}
