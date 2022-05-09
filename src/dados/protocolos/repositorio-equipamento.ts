import { InserirModeloEquipamento } from '../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ModeloEquipamento } from '../../dominio/modelos/equipamento'

export interface RepositorioEquipamento {
  inserir: (inserirModeloEquipamento: InserirModeloEquipamento) => Promise<ModeloEquipamento>
}
