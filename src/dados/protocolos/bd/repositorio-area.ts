import { ModeloArea } from '../../../dominio/modelos/area'

export type ModelosAreas = ModeloArea | ModeloArea[] | any

export interface RepositorioArea {
  consultar: (area?: string) => Promise<ModelosAreas>
}
