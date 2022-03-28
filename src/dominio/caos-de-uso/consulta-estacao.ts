import { ModeloEstacao } from '../modelos/estacao'

export interface ConsultaEstacao {
  consultaTodas: () => Promise<ModeloEstacao[]>

  consulta: (requisicaoHttp: string) => Promise<ModeloEstacao>
}
