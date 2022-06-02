import { RepositorioAlerta } from '../../../../dados/protocolos/bd/repositorio-alerta'
import { DadosAlerta } from '../../../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ModeloAlerta } from '../../../../dominio/modelos/alerta'
import { Alerta } from '../models/modelo-alerta'

export class RepositorioAlertaMariaDB implements RepositorioAlerta {
  async inserir (dadosAlerta: DadosAlerta): Promise<ModeloAlerta> {
    const alerta = await Alerta.create(this.transformaDados(dadosAlerta))
    const dataInicio = new Date(alerta.dataInicio).toISOString()
    const dataFim = new Date(alerta.dataFim).toISOString()
    return {
      id: alerta.id.toString(),
      descricao: alerta.descricao.toString(),
      prioridade: alerta.prioridade.toString(),
      dataInicio,
      dataFim,
      ativo: String(alerta.ativo),
      estacaoId: alerta.estacaoId.toString()
    }
  }

  private transformaDados (dadosAlerta: DadosAlerta): any {
    const { descricao, prioridade, dataInicio, dataFim, ativo, estacaoId } = dadosAlerta
    return {
      descricao: descricao,
      prioridade: prioridade,
      dataInicio: dataInicio,
      dataFim: dataFim,
      ativo: (ativo === 'true'),
      estacaoId: +estacaoId
    }
  }
}
