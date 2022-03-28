import { ModeloEstacao } from '../modelos/estacao'

export interface ConsultaEstacao {
  consultaTodas: () => Promise<ModeloEstacao[]>

  consulta: (parametro: string) => Promise<ModeloEstacao>
}
