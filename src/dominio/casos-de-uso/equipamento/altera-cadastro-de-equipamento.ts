import { DadosEquipamento } from './cadastro-de-equipamento'

export interface AlteraCadastroDeEquipamento {
  alterar: (dadosEquipamento: DadosEquipamento) => Promise<string>
}
