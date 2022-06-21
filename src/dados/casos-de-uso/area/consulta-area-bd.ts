import { ConsultaArea } from '../../../dominio/casos-de-uso/area/consulta-area'
import { ModeloArea } from '../../../dominio/modelos/area'
import { RepositorioArea } from '../../protocolos/bd/repositorio-area'

export class ConsultaAreaBD implements ConsultaArea {
  constructor (private readonly repositorioArea: RepositorioArea) {}

  async consultarTodas (): Promise<ModeloArea[]> {
    const resposta = await this.repositorioArea.consultar()
    return resposta
  }

  async consultar (area: string): Promise<ModeloArea> {
    const resposta = await this.repositorioArea.consultar(area)
    return resposta
  }
}