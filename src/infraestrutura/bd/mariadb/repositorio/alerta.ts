import { RepositorioAlerta, DadosAlerta, ModeloAlerta } from '../../../../dados/protocolos/bd/alerta/repositorio-alerta'
import { ModelosAlertas, RepositorioConsultaAlerta } from '../../../../dados/protocolos/bd/alerta/repositorio-consulta-alerta-todas'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Alerta } from '../models/modelo-alerta'

export class RepositorioAlertaMariaDB implements RepositorioAlerta, RepositorioConsultaAlerta {
  async inserir (dadosAlerta: DadosAlerta): Promise<ModeloAlerta> {
    AuxiliaresMariaDB.verificaConexao()
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

  async consultar (parametro?: string): Promise<ModelosAlertas> {
    AuxiliaresMariaDB.verificaConexao()
    if (parametro) { //eslint-disable-line
      return await Alerta.findOne({ where: { id: parametro } })
    }
    return await Alerta.findAll()
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
