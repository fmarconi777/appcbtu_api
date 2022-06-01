import { DadosAlerta } from '../../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'

export interface RepositorioAlerta {
  inserir: (adicionarAlerta: DadosAlerta) => Promise<ModeloAlerta>
}
