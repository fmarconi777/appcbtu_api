import { ModeloAlerta } from '../../../../dominio/modelos/alerta'

export interface RepositorioAlertaConsultaPorId {
  consultarPorId: (id: number) => Promise<ModeloAlerta | null>
}
