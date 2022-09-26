import { ModeloFalha } from '../../../../dominio/modelos/falha'

export interface RepositorioConsultaFalha {
  consultar: (id?: number) => Promise<ModeloFalha | ModeloFalha[] | null>
}
