export interface DadosTelefone {
  numero: number
  estacaoId: number
}

export interface CadastroDeTelefone {
  inserir: (dados: DadosTelefone) => Promise<string | null>
}
