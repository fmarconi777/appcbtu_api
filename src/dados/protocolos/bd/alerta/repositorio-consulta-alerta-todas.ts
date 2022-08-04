import { ModeloAlerta } from './repositorio-alerta'

export type ModelosAlertas = ModeloAlerta | ModeloAlerta[] | any

export interface RepositorioConsultaAlerta {
  consultar: (parametro?: string) => Promise<ModelosAlertas>
}
