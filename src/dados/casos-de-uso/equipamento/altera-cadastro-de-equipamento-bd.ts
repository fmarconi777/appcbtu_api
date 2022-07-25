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
    await this.repositorioConsultaEquipamento.consultar(+dadosEquipamento.id)
    await this.repositorioAlteraCadastroDeEquipamento.alterar(dadosEquipamento)
    return await new Promise(resolve => resolve(''))
  }
}
