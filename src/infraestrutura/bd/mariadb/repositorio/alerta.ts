import { RepositorioAlerta } from '../../../../dados/protocolos/bd/repositorio-alerta'
import { DadosAlerta } from '../../../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ModeloAlerta } from '../../../../dominio/modelos/alerta'
import { Alerta } from '../models/modelo-alerta'
import { FuncoesAuxiliares } from '../auxiliares/funcoes-auxiliares'

export class RepositorioAlertaMariaDB implements RepositorioAlerta {
  async inserir (dadosAlerta: DadosAlerta): Promise<ModeloAlerta> {
    const alerta = await Alerta.create(this.transformaDados(dadosAlerta))
    return FuncoesAuxiliares.mapeadorDeDados(alerta)
  }

  private transformaDados (dadosAlerta: DadosAlerta): any {
    const { descricao, prioridade, dataInicio, dataFim, ativo, estacaoId } = dadosAlerta
    return {
      descricao: descricao,
      prioridade: prioridade,
      dataInicio: dataInicio,
      dataFim: dataFim,
      ativo: ativo,
      estacaoId: +estacaoId
    }
  }
}
