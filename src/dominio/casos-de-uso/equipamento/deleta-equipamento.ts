export interface DeletaEquipamento {
  deletar: (id: number) => Promise<string | null>
}
