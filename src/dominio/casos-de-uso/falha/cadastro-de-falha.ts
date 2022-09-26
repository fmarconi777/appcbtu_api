export interface DadosFalha {
  numFalha: string
  dataCriacao: string
  equipamentoId: string
}

export interface CadastroDeFalha {
  inserir: (dados: DadosFalha) => Promise<string | null>
}
