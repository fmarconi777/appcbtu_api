import { DadosFalha } from '../../../../dominio/casos-de-uso/falha/cadastro-de-falha'

export interface RepositorioCadastroFalha {
  inserir: (dados: DadosFalha) => Promise<string>
}
