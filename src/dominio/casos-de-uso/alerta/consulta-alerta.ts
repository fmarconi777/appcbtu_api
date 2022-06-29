import { ModeloAlerta } from '../../modelos/alerta'

export interface ConsultaAlerta {
  consultaalerta: (parametro: string) => Promise<ModeloAlerta>

  consultaalertaTodas: () => Promise<ModeloAlerta>
}
