import { ModeloEquipamento } from '../../../../dominio/modelos/equipamento'

export interface RepositorioAlteraCadastroDeEquipamento {
  alterar: (dadosEquipamento: ModeloEquipamento) => Promise<string>
}
