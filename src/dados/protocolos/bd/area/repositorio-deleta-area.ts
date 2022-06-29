export interface RepositorioDeletaArea {
  deletar: (nome: string) => Promise<string>
}
