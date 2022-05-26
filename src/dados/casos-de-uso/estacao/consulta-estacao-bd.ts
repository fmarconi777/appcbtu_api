import { ConsultaEstacao } from '../../../dominio/casos-de-uso/estacao/consulta-estacao'
import { ModeloEstacao } from '../../../dominio/modelos/estacao'
import { RepositorioEstacao } from '../../protocolos/bd/repositorio-estacao'

export class ConsultaEstacaoBD implements ConsultaEstacao {
  private readonly consultaRepositorioEstacao: RepositorioEstacao

  constructor (consultaRepositorioEstacao: RepositorioEstacao) {
    this.consultaRepositorioEstacao = consultaRepositorioEstacao
  }

  async consultaTodas (): Promise<ModeloEstacao[]> {
    return await this.consultaRepositorioEstacao.consulta()
  }

  async consulta (parametro: string): Promise<ModeloEstacao> {
    return await this.consultaRepositorioEstacao.consulta(parametro)
  }
}
