import { ConsultaArea } from '../../../dominio/casos-de-uso/area/consulta-area'
import { ModeloArea } from '../../../dominio/modelos/area'
import { RepositorioArea } from '../../protocolos/bd/repositorio-area'

export class ConsultaAreaBD implements ConsultaArea {
  constructor (private readonly repositorioArea: RepositorioArea) {}

  async consultarTodas (): Promise<ModeloArea[]> {
    await this.repositorioArea.consultar()
    return await new Promise(resolve => resolve([]))
  }

  async consultar (area: string): Promise<ModeloArea> {
    await this.repositorioArea.consultar(area)
    return await new Promise(resolve => resolve({
      id: 'id_qualquer',
      nome: 'nome_qualquer'
    }))
  }
}
