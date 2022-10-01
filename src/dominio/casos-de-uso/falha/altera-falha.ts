export interface FalhaAlterada {
  id: number
  numFalha: number
  equipamentoId: number
}

export interface AlteraFalha {
  alterar: (dados: FalhaAlterada) => Promise<string | null>
}
