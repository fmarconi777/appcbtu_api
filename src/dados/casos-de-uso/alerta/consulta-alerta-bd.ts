import { ConsultaAlerta } from '../../../dominio/casos-de-uso/alerta/consulta-alerta'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { RepositorioAlertaConsultaPorId } from '../../protocolos/bd/alerta/repositorio-consulta-alerta-por-id'
import { RepositorioConsultaAlerta } from '../../protocolos/bd/alerta/repositorio-consulta-alerta-todas'

export class ConsultaAlertaBD implements ConsultaAlerta {
  constructor (
    private readonly repositorioConsultaAlerta: RepositorioConsultaAlerta,
    private readonly repositorioAlertaConsultaPorIdStub: RepositorioAlertaConsultaPorId
  ) {}

  async consultarTodas (): Promise<ModeloAlerta[]> {
    const resposta = await this.repositorioConsultaAlerta.consultar()
    return resposta
  }

  async consultar (sigla: string, id?: number): Promise<ModeloAlerta | ModeloAlerta[] | null> {
    if (!id) { //eslint-disable-line
      const resposta = await this.repositorioConsultaAlerta.consultar(sigla)
      return resposta
    }
    await this.repositorioAlertaConsultaPorIdStub.consultarPorId(id)
    return null
  }
}
