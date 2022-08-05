export interface RepositorioAlteraAlertaAtivo {
  alterarAtivo: (ativo: string, id: number) => Promise<string>
}
