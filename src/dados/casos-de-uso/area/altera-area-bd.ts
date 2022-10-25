import { AlteraArea } from '@/dominio/casos-de-uso/area/altera-area'
import { RepositorioAlteraArea } from '@/dados/protocolos/bd/area/repositorio-altera-area'
import { ConsultaAreaPorNome } from '@/dados/protocolos/bd/area/repositorio-consulta-area-por-nome'
import { ValidadorBD } from '@/dados/protocolos/utilidades/validadorBD'

export class AlteraAreaBD implements AlteraArea {
  constructor (
    private readonly validaArea: ValidadorBD,
    private readonly consultaAreaPorNome: ConsultaAreaPorNome,
    private readonly repositorioAlteraArea: RepositorioAlteraArea
  ) {}

  async alterar (nome: string, parametro: string): Promise<string | null> {
    const areaValida = await this.validaArea.validar(parametro)
    if (areaValida) {
      const area = await this.consultaAreaPorNome.consultarPorNome(nome)
      if (area) { //eslint-disable-line
        return 'área já cadastrada'
      }
      return await this.repositorioAlteraArea.alterar(nome, parametro)
    }
    return null
  }
}
