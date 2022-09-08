import { ConsultaAlerta } from '../../../dominio/casos-de-uso/alerta/consulta-alerta'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { RepositorioAlteraAlertaAtivo } from '../../protocolos/bd/alerta/repositorio-altera-alerta-ativo'
import { RepositorioConsultaAlerta } from '../../protocolos/bd/alerta/repositorio-consulta-alerta-todas'
import { AuxiliarAlerta } from '../../protocolos/utilidades/auxiliar-alerta'

export class ConsultaAlertaBD implements ConsultaAlerta {
  constructor (
    private readonly repositorioConsultaAlerta: RepositorioConsultaAlerta,
    private readonly repositorioAlteraAlertaAtivo: RepositorioAlteraAlertaAtivo,
    private readonly auxiliarAlerta: AuxiliarAlerta
  ) {}

  async consultarTodas (): Promise<ModeloAlerta[]> {
    const alertas: ModeloAlerta[] = await this.repositorioConsultaAlerta.consultar()
    if (alertas) { //eslint-disable-line
      return await this.auxiliarAlerta.filtrarAlertas(alertas, this.repositorioAlteraAlertaAtivo)
    }
    return []
  }

  async consultar (sigla: string, id?: number): Promise<ModeloAlerta | ModeloAlerta[] | null | string> {
    if (!id) { //eslint-disable-line
      const alertas: ModeloAlerta[] = await this.repositorioConsultaAlerta.consultar(sigla)
      if (alertas) { //eslint-disable-line
        return await this.auxiliarAlerta.filtrarAlertas(alertas, this.repositorioAlteraAlertaAtivo)
      }
      return []
    }
    const alerta = await this.repositorioConsultaAlerta.consultar(sigla, +id)
    if (alerta) { //eslint-disable-line
      if (this.auxiliarAlerta.compararDatas(alerta.dataFim)) {
        return await this.repositorioAlteraAlertaAtivo.alterarAtivo(false, +alerta.id)
      }
      return alerta
    }
    return alerta
  }
}
