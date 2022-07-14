import { ModeloFalha } from '../../modelos/falha'

export interface CadastroDeFalha {
  inserir: (dados: ModeloFalha) => Promise<string>
}
