import { ModeloEstacao } from '@/dominio/modelos/estacao'

export type ModelosEstacoes = ModeloEstacao | ModeloEstacao[] | any

export interface RepositorioEstacao {
  consultar: (sigla?: string) => Promise<ModelosEstacoes>
}
