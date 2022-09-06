import { ModeloAlerta } from '../../modelos/alerta'

export interface AlertaValidado {
  valido: boolean
  resposta: string
}

export interface AlteraAlerta {
  alterar: (dados: ModeloAlerta) => Promise<AlertaValidado>
}
