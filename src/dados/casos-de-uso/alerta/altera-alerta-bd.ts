import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'
import { AlertaValidado, AlteraAlerta } from '../../../dominio/casos-de-uso/alerta/altera-alerta'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { RepositorioAlteraAlerta } from '../../protocolos/bd/alerta/repositorio-altera-alerta'

export class AlteraAlertaBD implements AlteraAlerta {
  constructor (
    private readonly validadorDeAlerta: ValidadorBD,
    private readonly validadorDeEstacao: ValidadorBD,
    private readonly repositorioAlteraAlerta: RepositorioAlteraAlerta
  ) {}

  async alterar (dados: ModeloAlerta): Promise<AlertaValidado> {
    const alertaValido = await this.validadorDeAlerta.validar(+dados.id)
    if (alertaValido) {
      const estacaoValida = await this.validadorDeEstacao.validar(+dados.estacaoId)
      if (estacaoValida) {
        await this.repositorioAlteraAlerta.alterar(dados)
        return await Promise.resolve({ valido: true, resposta: '' })
      }
      return { valido: false, resposta: 'estacaoId' }
    }
    return { valido: false, resposta: 'id' }
  }
}
