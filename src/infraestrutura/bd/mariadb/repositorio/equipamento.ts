import { RepositorioEquipamento, DadosEquipamento, ModeloEquipamento } from '@/dados/protocolos/bd/equipamento/repositorio-equipamento'
import { RepositorioConsultaEquipamento } from '@/dados/protocolos/bd/equipamento/repositorio-consulta-equipamento'
import { RepositorioAlteraCadastroDeEquipamento } from '@/dados/protocolos/bd/equipamento/repositorio-altera-cadastro-de-equipamento'
import { RepositorioAlteraEstadoDeEquipamento, EstadoEquipamento } from '@/dados/protocolos/bd/equipamento/repositorio-altera-estado-de-equipamento'
import { RepositorioDeletaEquipamento } from '@/dados/protocolos/bd/equipamento/repositorio-deleta-equipamento'
import { Equipamento } from '@/infraestrutura/bd/mariadb/models/modelo-equipamento'
import { FuncoesAuxiliares } from '@/infraestrutura/bd/mariadb/auxiliares/funcoes-auxiliares'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'

export class RepositorioEquipamentoMariaDB implements
RepositorioEquipamento,
RepositorioConsultaEquipamento,
RepositorioAlteraCadastroDeEquipamento,
RepositorioAlteraEstadoDeEquipamento,
RepositorioDeletaEquipamento {
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

  async alterarEstado (dadosEquipamento: EstadoEquipamento): Promise<string> {
    AuxiliaresMariaDB.verificaConexao()
    await Equipamento.update({ estado: +dadosEquipamento.estado }, { where: { id: +dadosEquipamento.id } })
    return 'Estado alterado com sucesso'
  }

  async deletar (id: number): Promise<string> {
    AuxiliaresMariaDB.verificaConexao()
    await Equipamento.destroy({ where: { id }, cascade: true })
    return 'Equipamento deletado com sucesso'
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
