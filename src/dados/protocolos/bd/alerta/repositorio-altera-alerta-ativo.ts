export interface RepositorioAlteraAlertaAtivo {
  alterarAtivo: (ativo: boolean, id: number) => Promise<string>
}
