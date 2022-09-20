import { ConsultaArea } from '../../../dominio/casos-de-uso/area/consulta-area'
import { ModeloArea } from '../../../dominio/modelos/area'
import { RepositorioArea } from '../../protocolos/bd/area/repositorio-area'
import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'

export class ConsultaAreaBD implements ConsultaArea {
  constructor (
    private readonly validaArea: ValidadorBD,
    private readonly repositorioArea: RepositorioArea
  ) {}

  async consultarTodas (): Promise<ModeloArea[]> {
    const resposta = await this.repositorioArea.consultar()
    return resposta
  }

  async consultar (area: string): Promise<ModeloArea | null> {
    const areValida = await this.validaArea.validar(area)
    if (areValida) {
      const resposta = await this.repositorioArea.consultar(area)
      return resposta
    }
    return null
  }
}
