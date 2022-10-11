export interface CadastroDeTelefone {
  inserir: (numero: number, estacaoId: number) => Promise<string | null>
}
