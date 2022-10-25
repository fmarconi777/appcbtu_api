import { ModeloAlerta } from '@/dominio/modelos/alerta'

export interface RepositorioAlteraAlerta {
  alterar: (dados: ModeloAlerta) => Promise<string>
}
