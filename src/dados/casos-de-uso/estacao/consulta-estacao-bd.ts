import { ConsultaEstacao } from '../../../dominio/casos-de-uso/estacao/consulta-estacao'
import { ModeloEstacao } from '../../../dominio/modelos/estacao'
import { RepositorioEstacao } from '../../protocolos/bd/estacao/repositorio-estacao'

export class ConsultaEstacaoBD implements ConsultaEstacao {
  private readonly consultaRepositorioEstacao: RepositorioEstacao

  constructor (consultaRepositorioEstacao: RepositorioEstacao) {
    this.consultaRepositorioEstacao = consultaRepositorioEstacao
  }

  async consultarTodas (): Promise<ModeloEstacao[]> {
    return await this.consultaRepositorioEstacao.consultar()
  }

  async consultar (parametro: string): Promise<ModeloEstacao> {
    return await this.consultaRepositorioEstacao.consultar(parametro)
  }
}
