export interface DadosAlterados {
  id: string
  descricao: string
  prioridade: string
  dataInicio: string
  dataFim: string
  estacaoId: string
}

export interface AlertaValidado {
  valido: boolean
  resposta: string
}

export interface AlteraAlerta {
  alterar: (dados: DadosAlterados) => Promise<AlertaValidado>
}
