export interface AlteraArea {
  alterar: (nome: string, parametro: string) => Promise<string>
}
