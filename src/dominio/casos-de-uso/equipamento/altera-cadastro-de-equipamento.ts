import { ModeloEquipamento } from '../../modelos/equipamento'

export interface EquipamentoValido {
  invalido: boolean
  parametro: string
  cadastro?: string
}

export interface AlteraCadastroDeEquipamento {
  alterar: (dadosEquipamento: ModeloEquipamento) => Promise<EquipamentoValido>
}
