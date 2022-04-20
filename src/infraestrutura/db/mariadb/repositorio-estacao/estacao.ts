import { ConsultaRepositorioEstacao, ModelosEstacoes } from '../../../../dados/protocolos/consulta-repositorio-estacao'
import { Estacao } from '../models/modelo-estacao'

export class RepositorioEstacaoMariaDB implements ConsultaRepositorioEstacao {
  async consulta (sigla?: string): Promise<ModelosEstacoes> {
    const estacao = await Estacao.findOne({ where: { sigla: sigla } })
    return estacao
  }
}
