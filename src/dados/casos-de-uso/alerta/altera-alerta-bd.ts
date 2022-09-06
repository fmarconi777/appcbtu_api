import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'
import { AlertaValidado, AlteraAlerta } from '../../../dominio/casos-de-uso/alerta/altera-alerta'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'

export class AlteraAlertaBD implements AlteraAlerta {
  constructor (
    private readonly validadorDeAlerta: ValidadorBD,
    private readonly validadorDeEstacao: ValidadorBD
  ) {}

  async alterar (dados: ModeloAlerta): Promise<AlertaValidado> {
    const alertaValido = await this.validadorDeAlerta.validar(+dados.id)
    if (alertaValido) {
      const estacaoValida = await this.validadorDeEstacao.validar(+dados.estacaoId)
      if (estacaoValida) {
        return await Promise.resolve({ valido: true, resposta: '' })
      }
      return { valido: false, resposta: 'estacaoId' }
    }
    return { valido: false, resposta: 'id' }
  }
}
