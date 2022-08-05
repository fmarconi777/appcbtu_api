import { ModeloAlerta } from '../../modelos/alerta'

export interface ConsultaAlerta {
  consultar: (sigla: string, id?: number) => Promise<ModeloAlerta | ModeloAlerta[] | null | string>

  consultarTodas: () => Promise<ModeloAlerta[]>
}
