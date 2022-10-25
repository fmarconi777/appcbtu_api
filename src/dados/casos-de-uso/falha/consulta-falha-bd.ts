import { ConsultaFalha } from '@/dominio/casos-de-uso/falha/consulta-falha'
import { ModeloFalha } from '@/dominio/modelos/falha'
import { RepositorioConsultaFalha } from '@/dados/protocolos/bd/falha/repositorio-consulta-falha'

export class ConsultaFalhaBD implements ConsultaFalha {
  constructor (private readonly repositorioConsultaFalha: RepositorioConsultaFalha) {}

  async consultarTodas (): Promise<ModeloFalha[]> {
    const falhas: any = await this.repositorioConsultaFalha.consultar()
    return falhas
  }

  async consultar (id: number): Promise<ModeloFalha | null> {
    const falha: any = await this.repositorioConsultaFalha.consultar(id)
    return falha
  }
}
