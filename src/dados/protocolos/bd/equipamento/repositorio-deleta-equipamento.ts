export interface RepositorioDeletaEquipamento {
  deletar: (id: number) => Promise<string>
}
