import { CadastroArea } from '../../../dominio/casos-de-uso/area/cadastro-de-area'
import { ModeloArea } from '../../../dominio/modelos/area'
import { ConsultaAreaPorNome } from '../../protocolos/bd/area/repositorio-consulta-area-por-nome'

export class CadastroDeAreaBD implements CadastroArea {
  constructor (
    private readonly consultaAreaPorNome: ConsultaAreaPorNome
  ) {}

  async inserir (nome: string): Promise<ModeloArea> {
    await this.consultaAreaPorNome.consultaPorNome(nome)
    return await new Promise(resolve => resolve({ id: '', nome: '' }))
  }
}
