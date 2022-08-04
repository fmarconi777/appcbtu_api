import { ConsultaAlerta } from '../../../dominio/casos-de-uso/alerta/consulta-alerta'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { RepositorioConsultaAlerta } from '../../protocolos/bd/alerta/repositorio-consulta-alerta-todas'

export class ConsultaAlertaBD implements ConsultaAlerta {
  constructor (
    private readonly repositorioConsultaAlerta: RepositorioConsultaAlerta
  ) {}

  async consultaalertaTodas (): Promise<ModeloAlerta[]> {
    const resposta = await this.repositorioConsultaAlerta.consultaalerta()
    return resposta
  }

  async consultaalerta (sigla: string, id?: number): Promise<ModeloAlerta | ModeloAlerta[] | null> {
    if (!id) { //eslint-disable-line
      const resposta = await this.repositorioConsultaAlerta.consultaalerta(sigla)
      return resposta
    }
    return null
  }
}
