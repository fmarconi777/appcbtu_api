import { ModeloAlerta } from './repositorio-alerta'

export type ModelosAlertas = ModeloAlerta | ModeloAlerta[] | any

export interface RepositorioConsultaAlerta {
  consultar: (sigla?: string, idAlerta?: number) => Promise<ModelosAlertas>
}
