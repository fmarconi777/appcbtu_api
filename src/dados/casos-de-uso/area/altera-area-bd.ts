import { AlteraArea } from '../../../dominio/casos-de-uso/area/altera-area'
import { RepositorioAlteraArea } from '../../protocolos/bd/area/repositorio-altera-area'
import { ConsultaAreaPorNome } from '../../protocolos/bd/area/repositorio-consulta-area-por-nome'

export class AlteraAreaBD implements AlteraArea {
  constructor (
    private readonly consultaAreaPorNome: ConsultaAreaPorNome,
    private readonly repositorioAlteraArea: RepositorioAlteraArea
  ) {}

  async alterar (nome: string, parametro: string): Promise<string> {
    const area = await this.consultaAreaPorNome.consultarPorNome(nome)
    if (area) { //eslint-disable-line
      return 'área já cadastrada'
    }
    return await this.repositorioAlteraArea.alterar(nome, parametro)
  }
}
