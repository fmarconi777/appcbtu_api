import { ModeloAlerta } from './repositorio-alerta'

export type ModelosAlertas = ModeloAlerta | ModeloAlerta[] | any

export interface RepositorioConsultaAlerta {
  consultaalerta: (parametro?: string) => Promise<ModelosAlertas>
}
