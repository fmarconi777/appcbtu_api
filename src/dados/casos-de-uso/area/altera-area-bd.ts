import { AlteraArea } from '../../../dominio/casos-de-uso/area/altera-area'
import { ConsultaAreaPorNome } from '../../protocolos/bd/area/repositorio-consulta-area-por-nome'

export class AlteraAreaBD implements AlteraArea {
  constructor (private readonly consultaAreaPorNome: ConsultaAreaPorNome) {}

  async alterar (nome: string): Promise<string> {
    await this.consultaAreaPorNome.consultarPorNome(nome)
    return await new Promise(resolve => resolve(''))
  }
}
