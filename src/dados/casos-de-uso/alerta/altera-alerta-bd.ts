import { AlteraAlerta } from '../../../dominio/casos-de-uso/alerta/altera-alerta'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { ConsultaAlertaPorId } from '../../protocolos/bd/alerta/repositorio-consulta-alerta-por-id'

export class AlteraAlertaBD implements AlteraAlerta {
  constructor (private readonly consultaAlertaPorId: ConsultaAlertaPorId) {}

  async alterar (dados: ModeloAlerta): Promise<string | null> {
    await this.consultaAlertaPorId.consultarPorId(+dados.id)
    return await Promise.resolve(null)
  }
}
