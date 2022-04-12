import { ModeloEstacao } from '../../dominio/modelos/estacao'

export type ModelosEstacoes = ModeloEstacao | ModeloEstacao[] | any

export interface ConsultaRepositorioEstacao {
  consulta: (sigla?: string) => Promise<ModelosEstacoes>
}
