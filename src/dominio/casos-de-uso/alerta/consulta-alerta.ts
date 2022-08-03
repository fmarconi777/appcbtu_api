import { ModeloAlerta } from '../../modelos/alerta'

export interface ConsultaAlerta {
  consultaalerta: (parametro: string, parametro2?: number) => Promise<ModeloAlerta | null>

  consultaalertaTodas: () => Promise<ModeloAlerta[]>
}
