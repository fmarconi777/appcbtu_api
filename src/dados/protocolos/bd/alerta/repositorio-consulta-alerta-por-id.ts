import { ModeloAlerta } from '../../../../dominio/modelos/alerta'

export interface ConsultaAlertaPorId {
  consultarPorId: (id: number) => Promise<ModeloAlerta | null>
}
