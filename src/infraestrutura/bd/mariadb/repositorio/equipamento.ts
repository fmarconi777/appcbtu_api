import { RepositorioEquipamento } from '../../../../dados/protocolos/bd/repositorio-equipamento'
import { DadosEquipamento } from '../../../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ModeloEquipamento } from '../../../../dominio/modelos/equipamento'
import { Equipamento } from '../models/modelo-equipamento'
import { FuncoesAuxiliares } from '../auxiliares/funcoes-auxiliares'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'

export class RepositorioEquipamentoMariaDB implements RepositorioEquipamento {
  async inserir (dadosEquipamento: DadosEquipamento): Promise<ModeloEquipamento> {
    AuxiliaresMariaDB.verificaConexao()
    const equipamento = await Equipamento.create(this.transformaDados(dadosEquipamento))
    return FuncoesAuxiliares.mapeadorDeDados(equipamento)
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
}
