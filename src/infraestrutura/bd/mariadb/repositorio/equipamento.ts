import { RepositorioEquipamento, DadosEquipamento, ModeloEquipamento } from '../../../../dados/protocolos/bd/equipamento/repositorio-equipamento'
import { Equipamento } from '../models/modelo-equipamento'
import { FuncoesAuxiliares } from '../auxiliares/funcoes-auxiliares'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { RepositorioConsultaEquipamento } from '../../../../dados/protocolos/bd/equipamento/repositorio-consulta-equipamento'
import { RepositorioAlteraCadastroDeEquipamento } from '../../../../dados/protocolos/bd/equipamento/repositorio-altera-cadastro-de-equipamento'

export class RepositorioEquipamentoMariaDB implements
RepositorioEquipamento,
RepositorioConsultaEquipamento,
RepositorioAlteraCadastroDeEquipamento {
  async inserir (dadosEquipamento: DadosEquipamento): Promise<string> {
    AuxiliaresMariaDB.verificaConexao()
    await Equipamento.create(this.transformaDados(dadosEquipamento))
    return 'Equipamento cadastrado com sucesso'
  }

  async consultar (id?: number | undefined): Promise<ModeloEquipamento | ModeloEquipamento[] | any> {
    AuxiliaresMariaDB.verificaConexao()
    if (id) { // eslint-disable-line
      const equipamento = await Equipamento.findOne({ where: { id } })
      return equipamento ? FuncoesAuxiliares.mapeadorDeDados(equipamento) : null // eslint-disable-line
    }
    return await Equipamento.findAll()
  }

  async alterar (dadosEquipamento: ModeloEquipamento): Promise<string> {
    AuxiliaresMariaDB.verificaConexao()
    await Equipamento.update(this.transformaDados(dadosEquipamento), { where: { id: +dadosEquipamento.id } })
    return 'Cadastro alterado com sucesso'
  }

  private transformaDados (dadosEquipamento: DadosEquipamento): any {
    const { nome, tipo, estado, estacaoId } = dadosEquipamento
    return {
      nome: nome,
      tipo: tipo,
      estado: +estado,
      estacaoId: +estacaoId
    }
  }
}
