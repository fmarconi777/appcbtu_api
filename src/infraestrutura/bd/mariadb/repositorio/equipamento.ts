import { RepositorioEquipamento, DadosEquipamento, ModeloEquipamento } from '../../../../dados/protocolos/bd/equipamento/repositorio-equipamento'
import { Equipamento } from '../models/modelo-equipamento'
import { FuncoesAuxiliares } from '../auxiliares/funcoes-auxiliares'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { RepositorioConsultaEquipamento } from '../../../../dados/protocolos/bd/equipamento/repositorio-consulta-equipamento'

export class RepositorioEquipamentoMariaDB implements RepositorioEquipamento, RepositorioConsultaEquipamento {
  async inserir (dadosEquipamento: DadosEquipamento): Promise<ModeloEquipamento> {
    AuxiliaresMariaDB.verificaConexao()
    const equipamento = await Equipamento.create(this.transformaDados(dadosEquipamento))
    return FuncoesAuxiliares.mapeadorDeDados(equipamento)
  }

  async consultar (id?: number | undefined): Promise<ModeloEquipamento | ModeloEquipamento[] | any> {
    return await Equipamento.findAll()
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
