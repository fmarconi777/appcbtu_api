export interface EstadoEquipamento {
  id: string
  estado: string
}

export interface AlteraEstadoDeEquipamento {
  alterar: (dadosEquipamento: EstadoEquipamento) => Promise<string | null>
}
