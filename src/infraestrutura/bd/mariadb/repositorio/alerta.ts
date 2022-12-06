import { RepositorioAlerta, DadosAlerta, ModeloAlerta } from '@/dados/protocolos/bd/alerta/repositorio-alerta'
import { RepositorioAlteraAlerta } from '@/dados/protocolos/bd/alerta/repositorio-altera-alerta'
import { RepositorioAlteraAlertaAtivo } from '@/dados/protocolos/bd/alerta/repositorio-altera-alerta-ativo'
import { ModelosAlertas, RepositorioConsultaAlerta } from '@/dados/protocolos/bd/alerta/repositorio-consulta-alerta-todas'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Alerta } from '@/infraestrutura/sequelize/models/modelo-alerta'
import { QueryTypes } from 'sequelize'

export class RepositorioAlertaMariaDB implements RepositorioAlerta,
RepositorioConsultaAlerta,
RepositorioAlteraAlertaAtivo,
RepositorioAlteraAlerta {
  async inserir (dadosAlerta: DadosAlerta): Promise<ModeloAlerta> {
    await AuxiliaresMariaDB.verificaConexao()
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
    await AuxiliaresMariaDB.verificaConexao()
    if (sigla) { //eslint-disable-line
      if(idAlerta) { //eslint-disable-line
        const consulta: any = await Alerta.sequelize?.query('select a.id, a.descricao, a.prioridade, a.dataInicio, a.dataFim, a.ativo, e.sigla from Alerta as a ' +
                                                          'left join Estacao as e ' +
                                                            'on a.estacaoId = e.id ' +
                                                          'where e.sigla = :sigla and a.id = :idAlerta and a.ativo = true;', { replacements: { sigla, idAlerta }, type: QueryTypes.SELECT, raw: true })
        if (consulta[0]) { //eslint-disable-line          
          const alerta = consulta[0]
          alerta.ativo = Boolean(alerta.ativo)
          return alerta
        }
        return null
      }
      const consulta: any = await Alerta.sequelize?.query('select a.id, a.descricao, a.prioridade, a.dataInicio, a.dataFim, a.ativo, e.sigla from Alerta as a ' +
                                                        'left join Estacao as e ' +
                                                          'on a.estacaoId = e.id ' +
                                                        'where e.sigla = :sigla and a.ativo = true;', { replacements: { sigla }, type: QueryTypes.SELECT, raw: true })
      if (consulta[0]) { //eslint-disable-line
        const arrayAlertas: any = []
        for (const valor of consulta) {
          valor.ativo = Boolean(valor.ativo)
          arrayAlertas.push(valor)
        }
        return arrayAlertas
      }
      return null
    }
    const consulta: any = await Alerta.sequelize?.query('select a.id, a.descricao, a.prioridade, a.dataInicio, a.dataFim, a.ativo, e.sigla from Alerta as a ' +
                                                      'left join Estacao as e ' +
                                                        'on a.estacaoId = e.id ' +
                                                      'where a.ativo = true;', { replacements: { sigla }, type: QueryTypes.SELECT, raw: true })
    if (consulta[0]) { //eslint-disable-line
      const arrayAlertas: any = []
      for (const valor of consulta) {
        valor.ativo = Boolean(valor.ativo)
        arrayAlertas.push(valor)
      }
      return arrayAlertas
    }
    return null
  }

  async alterarAtivo (ativo: boolean, id: number): Promise<null> {
    await AuxiliaresMariaDB.verificaConexao()
    await Alerta.update({ ativo }, { where: { id } })
    return null
  }

  async alterar (dados: ModeloAlerta): Promise<string> {
    await AuxiliaresMariaDB.verificaConexao()
    await Alerta.update(this.transformaDados(dados), { where: { id: +dados.id } })
    return 'Alerta alterado com sucesso'
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
