export interface RepositorioAlteraArea {
  alterar: (nome: string) => Promise<string>
}
