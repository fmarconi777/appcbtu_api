import { CadastroAlerta, DadosAlerta } from '../../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { RepositorioAlerta } from '../../protocolos/bd/alerta/repositorio-alerta'

export class CadastroDeAlerta implements CadastroAlerta {
  private readonly inserirRepositorioAlerta: RepositorioAlerta

  constructor (inserirRepositorioAlerta: RepositorioAlerta) {
    this.inserirRepositorioAlerta = inserirRepositorioAlerta
  }

  async inserir (dadosAlerta: DadosAlerta): Promise<ModeloAlerta> {
    return await this.inserirRepositorioAlerta.inserir(dadosAlerta)
  }
}
