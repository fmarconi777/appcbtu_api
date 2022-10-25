import { DadosTelefone } from '@/dominio/casos-de-uso/telefone/cadastro-de-telefone'

export interface RepositorioCadastroTelefone {
  inserir: (dados: DadosTelefone) => Promise<string>
}
