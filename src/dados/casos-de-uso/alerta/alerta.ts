import { CadastroAlerta, DadosAlerta } from '../../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { RepositorioAlerta } from '../../protocolos/bd/repositorio-alerta'

export class CadastroDeAlerta implements CadastroAlerta {
  private readonly adicionandoRepositorioAlerta: RepositorioAlerta

  constructor (adicionandoRepositorioAlerta: RepositorioAlerta) {
    this.adicionandoRepositorioAlerta = adicionandoRepositorioAlerta
  }

  async adicionando (dadosAlerta: DadosAlerta): Promise<ModeloAlerta> {
    return await this.adicionandoRepositorioAlerta.adicionando(dadosAlerta)
  }
}
