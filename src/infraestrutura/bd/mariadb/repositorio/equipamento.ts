import { RepositorioEquipamento } from '../../../../dados/protocolos/repositorio-equipamento'
import { DadosEquipamento } from '../../../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ModeloEquipamento } from '../../../../dominio/modelos/equipamento'
import { Equipamento } from '../models/modelo-equipamento'

export class RepositorioEquipamentoMariaDB implements RepositorioEquipamento {
  async inserir (dadosEquipamento: DadosEquipamento): Promise<ModeloEquipamento> {
    const { nome, tipo, numFalha, estado, estacaoId } = dadosEquipamento
    const equipamento = await Equipamento.create({
      nome: nome,
      tipo: tipo,
      numFalha: +numFalha,
      estado: +estado,
      estacaoId: +estacaoId
    })
    return Object.assign({}, {
      id: equipamento.id.toString(),
      nome: equipamento.nome,
      tipo: equipamento.tipo,
      numFalha: equipamento.numFalha.toString(),
      estado: equipamento.estado.toString(),
      estacaoId: equipamento.estacaoId.toString()
    })
  }
}
