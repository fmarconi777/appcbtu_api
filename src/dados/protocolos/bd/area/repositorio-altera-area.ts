export interface RepositorioAlteraArea {
  alterar: (nome: string, parametro: string) => Promise<string>
}
