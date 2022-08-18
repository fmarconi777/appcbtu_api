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

  async asyncFilter (vetor: any[], condicional: CallableFunction): Promise<[]> {
    return vetor.reduce(async (acumulador, elemento) => await condicional(elemento) ? [...await acumulador, elemento] : acumulador, []) //eslint-disable-line
  }

  async consultar (sigla: string, id?: number): Promise<ModeloAlerta | ModeloAlerta[] | null | string> {
    if (!id) { //eslint-disable-line
      const alertas: [] = await this.repositorioConsultaAlerta.consultar(sigla)
      if (alertas) { //eslint-disable-line
        const alertasAtivos = await this.asyncFilter(alertas, async (alerta: { dataFim: string, id: string }) => {
          const dataFimMenor = this.comparadorDeDatas.compararDatas(alerta.dataFim)
          if (dataFimMenor) {
            await this.repositorioAlteraAlertaAtivo.alterarAtivo(false, +alerta.id)
            return !dataFimMenor
          }
          return dataFimMenor
        })
        if (alertasAtivos.length === 0) {
          return 'Alerta inativo'
        }
        return alertasAtivos
      }
      return 'Alerta inativo'
    }
    const idValido = await this.repositorioAlertaConsultaPorId.consultarPorId(+id)
    if (idValido) { //eslint-disable-line
      const alerta = await this.repositorioConsultaAlerta.consultar(sigla, +id)
      if (alerta) { //eslint-disable-line
        if (this.comparadorDeDatas.compararDatas(alerta.dataFim)) {
          return await this.repositorioAlteraAlertaAtivo.alterarAtivo(false, +alerta.id)
        }
        return alerta
      }
      return 'Alerta inativo'
    }
    return idValido
  }
}
