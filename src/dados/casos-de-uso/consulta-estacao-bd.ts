import { ConsultaEstacao } from '../../dominio/caos-de-uso/consulta-estacao'
import { ModeloEstacao } from '../../dominio/modelos/estacao'
import { ConsultaRepositorioEstacao } from '../protocolos/consulta-repositorio-estacao'

export class ConsultaEstacaoBD implements ConsultaEstacao {
  private readonly consultaRepositorioEstacao: ConsultaRepositorioEstacao

  constructor (consultaRepositorioEstacao: ConsultaRepositorioEstacao) {
    this.consultaRepositorioEstacao = consultaRepositorioEstacao
  }

  async consultaTodas (): Promise<ModeloEstacao[]> {
    return await this.consultaRepositorioEstacao.consulta()
  }

  async consulta (parametro: string): Promise<ModeloEstacao> {
    return await this.consultaRepositorioEstacao.consulta(parametro)
  }
}
