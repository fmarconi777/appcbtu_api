import { CadastroDeEquipamento, InserirModeloEquipamento } from '../../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ModeloEquipamento } from '../../../dominio/modelos/equipamento'
import { RepositorioEquipamento } from '../../protocolos/repositorio-equipamento'

export class CadastroDeEquipamentoBd implements CadastroDeEquipamento {
  private readonly inserirRepositorioEquipamento: RepositorioEquipamento

  constructor (inserirRepositorioEquipamento: RepositorioEquipamento) {
    this.inserirRepositorioEquipamento = inserirRepositorioEquipamento
  }

  async inserir (dadsoDoEquipamento: InserirModeloEquipamento): Promise<ModeloEquipamento> {
    return await this.inserirRepositorioEquipamento.inserir(dadsoDoEquipamento)
  }
}
