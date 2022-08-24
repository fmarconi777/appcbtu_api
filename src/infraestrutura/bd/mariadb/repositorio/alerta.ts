import { QueryTypes } from 'sequelize'
import { RepositorioAlerta, DadosAlerta, ModeloAlerta } from '../../../../dados/protocolos/bd/alerta/repositorio-alerta'
import { RepositorioAlteraAlertaAtivo } from '../../../../dados/protocolos/bd/alerta/repositorio-altera-alerta-ativo'
import { ModelosAlertas, RepositorioConsultaAlerta } from '../../../../dados/protocolos/bd/alerta/repositorio-consulta-alerta-todas'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Alerta } from '../models/modelo-alerta'

export class RepositorioAlertaMariaDB implements RepositorioAlerta,
RepositorioConsultaAlerta,
RepositorioAlteraAlertaAtivo {
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

  async consultar (sigla?: string, idAlerta?: number): Promise<ModelosAlertas> { // refatorar consulta conforme o select do mysql
    AuxiliaresMariaDB.verificaConexao()
    if (sigla) { //eslint-disable-line
      if(idAlerta) { //eslint-disable-line
        const alerta: any = await Alerta.sequelize?.query('select a.id, a.descricao, a.prioridade, a.dataInicio, a.dataFim, a.ativo, e.sigla from Alerta as a ' +
                                             'left join Estacao as e ' +
                                               'on a.estacaoId = e.id ' +
                                             'where e.sigla = :sigla and a.id = :idAlerta and a.ativo = true;', { replacements: { sigla, idAlerta }, type: QueryTypes.SELECT, raw: true })
        return alerta[0] ? alerta[0] : null //eslint-disable-line
      }
      const alerta: any = await Alerta.sequelize?.query('select a.id, a.descricao, a.prioridade, a.dataInicio, a.dataFim, a.ativo, e.sigla from Alerta as a ' +
                                                      'left join Estacao as e ' +
                                                        'on a.estacaoId = e.id ' +
                                                      'where e.sigla = :sigla and a.ativo = true;', { replacements: { sigla }, type: QueryTypes.SELECT, raw: true })
      return alerta[0] ? alerta : null //eslint-disable-line
    }
    const alerta: any = await Alerta.sequelize?.query('select a.id, a.descricao, a.prioridade, a.dataInicio, a.dataFim, a.ativo, e.sigla from Alerta as a ' +
                                         'left join Estacao as e ' +
                                           'on a.estacaoId = e.id ' +
                                         'where a.ativo = true;', { replacements: { sigla }, type: QueryTypes.SELECT, raw: true })
    return alerta[0] ? alerta : null //eslint-disable-line
  }

  async alterarAtivo (ativo: boolean, id: number): Promise<string> {
    AuxiliaresMariaDB.verificaConexao()
    await Alerta.update({ ativo }, { where: { id } })
    return 'Alerta inativo'
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
