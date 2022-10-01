export interface FalhaAlterada {
  id: number
  numFalha: number
  equipamentoId: number
}

export interface FalhaValida {
  falhaInvalida: boolean
  parametro: string
}

export interface AlteraFalha {
  alterar: (dados: FalhaAlterada) => Promise<FalhaValida>
}
