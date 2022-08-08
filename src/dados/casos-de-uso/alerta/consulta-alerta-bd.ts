import { ConsultaAlerta } from '../../../dominio/casos-de-uso/alerta/consulta-alerta'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { RepositorioAlteraAlertaAtivo } from '../../protocolos/bd/alerta/repositorio-altera-alerta-ativo'
import { RepositorioAlertaConsultaPorId } from '../../protocolos/bd/alerta/repositorio-consulta-alerta-por-id'
import { RepositorioConsultaAlerta } from '../../protocolos/bd/alerta/repositorio-consulta-alerta-todas'
import { ComparadorDeDatas } from '../../protocolos/utilidades/comparador-de-datas'

export class ConsultaAlertaBD implements ConsultaAlerta {
  constructor (
    private readonly repositorioConsultaAlerta: RepositorioConsultaAlerta,
    private readonly repositorioAlertaConsultaPorId: RepositorioAlertaConsultaPorId,
    private readonly repositorioAlteraAlertaAtivo: RepositorioAlteraAlertaAtivo,
    private readonly comparadorDeDatas: ComparadorDeDatas
  ) {}

  async consultarTodas (): Promise<ModeloAlerta[]> {
    const resposta = await this.repositorioConsultaAlerta.consultar()
    return resposta
  }

  async consultar (sigla: string, id?: number): Promise<ModeloAlerta | ModeloAlerta[] | null | string> {
    if (!id) { //eslint-disable-line
      const resposta = await this.repositorioConsultaAlerta.consultar(sigla)
      return resposta
    }
    const idValido = await this.repositorioAlertaConsultaPorId.consultarPorId(+id)
    if (idValido) { //eslint-disable-line
      const alerta = await this.repositorioConsultaAlerta.consultar(sigla, +id) // pode me retornar null, tratar retorno caso seja null
      if (alerta) { //eslint-disable-line
        if (this.comparadorDeDatas.compararDatas(alerta.dataFim)) {
          await this.repositorioAlteraAlertaAtivo.alterarAtivo(false, +alerta.id)
        }
      }
      return 'Alerta inativo'
    }
    return idValido
  }
}
