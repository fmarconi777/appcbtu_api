import { ModeloEquipamento } from '../../modelos/equipamento'

export interface AlteraCadastroDeEquipamento {
  alterar: (dadosEquipamento: ModeloEquipamento) => Promise<string>
}
