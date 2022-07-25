import { AlteraCadastroDeEquipamento } from '../../../dominio/casos-de-uso/equipamento/altera-cadastro-de-equipamento'
import { RepositorioAlteraCadastroDeEquipamento } from '../../protocolos/bd/equipamento/repositorio-altera-cadastro-de-equipamento'
import { RepositorioConsultaEquipamento } from '../../protocolos/bd/equipamento/repositorio-consulta-equipamento'
import { ModeloEquipamento } from '../../protocolos/bd/equipamento/repositorio-equipamento'

export class AlteraCadastroDeEquipamentoBD implements AlteraCadastroDeEquipamento {
  constructor (
    private readonly repositorioAlteraCadastroDeEquipamento: RepositorioAlteraCadastroDeEquipamento,
    private readonly repositorioConsultaEquipamento: RepositorioConsultaEquipamento
  ) {}

  async alterar (dadosEquipamento: ModeloEquipamento): Promise<string | null> {
    const equipamento = await this.repositorioConsultaEquipamento.consultar(+dadosEquipamento.id)
    if (equipamento) { // eslint-disable-line
      await this.repositorioAlteraCadastroDeEquipamento.alterar(dadosEquipamento)
    }
    return equipamento
  }
}
