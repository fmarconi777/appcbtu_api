import { CadastroArea } from '../../../dominio/casos-de-uso/area/cadastro-de-area'
import { ModeloArea } from '../../../dominio/modelos/area'
import { ConsultaAreaPorNome } from '../../protocolos/bd/area/repositorio-consulta-area-por-nome'
import { RepositorioInserirArea } from '../../protocolos/bd/area/repositorio-inserir-area'

export class CadastroDeAreaBD implements CadastroArea {
  constructor (
    private readonly consultaAreaPorNome: ConsultaAreaPorNome,
    private readonly repositorioInserirArea: RepositorioInserirArea
  ) {}

  async inserir (nome: string): Promise<ModeloArea | string> {
    const area = await this.consultaAreaPorNome.consultarPorNome(nome)
    if (area) { //eslint-disable-line
      return 'área já cadastrada'
    }
    return await this.repositorioInserirArea.inserir(nome)
  }
}
