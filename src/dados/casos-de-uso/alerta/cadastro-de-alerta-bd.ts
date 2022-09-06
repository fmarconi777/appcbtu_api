import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'
import { CadastroAlerta, DadosAlerta } from '../../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { RepositorioAlerta } from '../../protocolos/bd/alerta/repositorio-alerta'

export class CadastroDeAlerta implements CadastroAlerta {
  constructor (
    private readonly inserirRepositorioAlerta: RepositorioAlerta,
    private readonly validadorDeEstacao: ValidadorBD
  ) {}

  async inserir (dadosAlerta: DadosAlerta): Promise<ModeloAlerta | null> {
    const estacaoValida = await this.validadorDeEstacao.validar(+dadosAlerta.estacaoId)
    if (estacaoValida) {
      return await this.inserirRepositorioAlerta.inserir(dadosAlerta)
    }
    return null
  }
}
