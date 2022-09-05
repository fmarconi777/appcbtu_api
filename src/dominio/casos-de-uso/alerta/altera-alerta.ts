import { ModeloAlerta } from '../../modelos/alerta'

export interface AlteraAlerta {
  alterar: (dados: ModeloAlerta) => Promise<string | null>
}
