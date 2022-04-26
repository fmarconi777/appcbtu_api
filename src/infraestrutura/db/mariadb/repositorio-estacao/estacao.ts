import { ConsultaRepositorioEstacao, ModelosEstacoes } from '../../../../dados/protocolos/consulta-repositorio-estacao'
import { Estacao } from '../models/modelo-estacao'

export class RepositorioEstacaoMariaDB implements ConsultaRepositorioEstacao {
  async consulta (sigla?: string): Promise<ModelosEstacoes> {
    if (!sigla) { // eslint-disable-line 
      return await Estacao.findAll()
    }
    return await Estacao.findOne({ where: { sigla: sigla } })
  }
}
