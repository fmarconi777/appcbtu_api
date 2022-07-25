import { AlteraCadastroDeEquipamento } from '../../../dominio/casos-de-uso/equipamento/altera-cadastro-de-equipamento'
import { RepositorioAlteraCadastroDeEquipamento } from '../../protocolos/bd/equipamento/repositorio-altera-cadastro-de-equipamento'
import { ModeloEquipamento } from '../../protocolos/bd/equipamento/repositorio-equipamento'

export class AlteraCadastroDeEquipamentoBD implements AlteraCadastroDeEquipamento {
  constructor (private readonly repositorioAlteraCadastroDeEquipamento: RepositorioAlteraCadastroDeEquipamento) {}

  async alterar (dadosEquipamento: ModeloEquipamento): Promise<string> {
    await this.repositorioAlteraCadastroDeEquipamento.alterar(dadosEquipamento)
    return await new Promise(resolve => resolve(''))
  }
}
