import { ModeloFalha } from '../../modelos/falha'

export interface ConsultaFalha {
  consultarTodas: () => Promise<ModeloFalha[]>

  consultar: (id: number) => Promise<ModeloFalha | null>
}
