import { ConsultaEstacao } from '../../../dominio/casos-de-uso/estacao/consulta-estacao'
import { ModeloEstacao } from '../../../dominio/modelos/estacao'
import { RepositorioEstacao } from '../../protocolos/bd/estacao/repositorio-estacao'

export class ConsultaEstacaoBD implements ConsultaEstacao {
  private readonly repositorioConsultaEstacao: RepositorioEstacao

  constructor (repositorioConsultaEstacao: RepositorioEstacao) {
    this.repositorioConsultaEstacao = repositorioConsultaEstacao
  }

  async consultarTodas (): Promise<ModeloEstacao[]> {
    return await this.repositorioConsultaEstacao.consultar()
  }

  async consultar (parametro: string): Promise<ModeloEstacao> {
    return await this.repositorioConsultaEstacao.consultar(parametro)
  }
}
