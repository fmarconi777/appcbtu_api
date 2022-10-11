export interface RepositorioCadastroTelefone {
  inserir: (numero: number, estacaoId: number) => Promise<string>
}
