import { ModeloEstacao } from '../../dominio/modelos/estacao'

export type ModelosEstacoes = ModeloEstacao | ModeloEstacao[] | any

export interface RepositorioEstacao {
  consulta: (sigla?: string) => Promise<ModelosEstacoes>
}
