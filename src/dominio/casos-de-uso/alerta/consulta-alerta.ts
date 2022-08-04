import { ModeloAlerta } from '../../modelos/alerta'

export interface ConsultaAlerta {
  consultaalerta: (sigla: string, id?: number) => Promise<ModeloAlerta | ModeloAlerta[] | null>

  consultaalertaTodas: () => Promise<ModeloAlerta[]>
}
