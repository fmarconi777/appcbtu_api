import { CadastroArea } from '@/dominio/casos-de-uso/area/cadastro-de-area'
import { ModeloArea } from '@/dominio/modelos/area'
import { ConsultaAreaPorId } from '@/dados/protocolos/bd/area/repositorio-consulta-area-por-id'
import { ConsultaAreaPorNome } from '@/dados/protocolos/bd/area/repositorio-consulta-area-por-nome'
import { RepositorioInserirArea } from '@/dados/protocolos/bd/area/repositorio-inserir-area'

export class CadastroDeAreaBD implements CadastroArea {
  constructor (
    private readonly consultaAreaPorNome: ConsultaAreaPorNome,
    private readonly consultaAreaPorId: ConsultaAreaPorId,
    private readonly repositorioInserirArea: RepositorioInserirArea
  ) {}

  async inserir (nome: string, id: number): Promise<ModeloArea | string> {
    const area = await this.consultaAreaPorNome.consultarPorNome(nome)
    if (area) { //eslint-disable-line
      return 'área já cadastrada'
    }
    const idCadastrada = await this.consultaAreaPorId.consultarPorId(id)
    if (idCadastrada) { //eslint-disable-line
      return 'id já cadastrada'
    }
    return await this.repositorioInserirArea.inserir(id, nome)
  }
}
