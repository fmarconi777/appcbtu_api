import { ModeloFalha } from '../../../../dominio/modelos/falha'

export interface RepositorioCadastroFalha {
  inserir: (dados: ModeloFalha) => Promise<string>
}
