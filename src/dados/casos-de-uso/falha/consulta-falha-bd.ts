import { ConsultaFalha } from '../../../dominio/casos-de-uso/falha/consulta-falha'
import { ModeloFalha } from '../../../dominio/modelos/falha'
import { RepositorioConsultaFalha } from '../../protocolos/bd/falha/repositorio-consulta-falha'

export class ConsultaFalhaBD implements ConsultaFalha {
  constructor (private readonly repositorioConsultaFalha: RepositorioConsultaFalha) {}

  async consultarTodas (): Promise<ModeloFalha[]> {
    const falhas: any = await this.repositorioConsultaFalha.consultar()
    return falhas
  }

  async consultar (id: number): Promise<ModeloFalha | null> {
    await this.repositorioConsultaFalha.consultar(id)
    return null
  }
}
