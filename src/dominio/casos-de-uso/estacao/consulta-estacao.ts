import { ModeloEstacao } from '../../modelos/estacao'

export interface ConsultaEstacao {
  consultarTodas: () => Promise<ModeloEstacao[]>

  consultar: (parametro: string) => Promise<ModeloEstacao>
}
