export interface DeletaArea {
  deletar: (nome: string) => Promise<string | null>
}
