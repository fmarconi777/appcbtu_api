import { RepositorioEquipamento } from '../../../../dados/protocolos/repositorio-equipamento'
import { DadosEquipamento } from '../../../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ModeloEquipamento } from '../../../../dominio/modelos/equipamento'
import { Equipamento } from '../models/modelo-equipamento'

export class RepositorioEquipamentoMariaDB implements RepositorioEquipamento {
  async inserir (dadosEquipamento: DadosEquipamento): Promise<ModeloEquipamento> {
    const equipamento = await Equipamento.create(this.transformaDados(dadosEquipamento))
    return this.mapeadorDeDados(equipamento)
  }

  private transformaDados (dadosEquipamento: DadosEquipamento): any {
    const { nome, tipo, numFalha, estado, estacaoId } = dadosEquipamento
    return {
      nome: nome,
      tipo: tipo,
      numFalha: +numFalha,
      estado: +estado,
      estacaoId: +estacaoId
    }
  }

  private mapeadorDeDados (dados: any): any {
    return Object.assign({}, {
      id: dados.id.toString(),
      nome: dados.nome,
      tipo: dados.tipo,
      numFalha: dados.numFalha.toString(),
      estado: dados.estado.toString(),
      estacaoId: dados.estacaoId.toString()
    })
  }
}
