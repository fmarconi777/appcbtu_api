import { DeletaEquipamento } from '../../../dominio/casos-de-uso/equipamento/deleta-equipamento'
import { RepositorioConsultaEquipamento } from '../../protocolos/bd/equipamento/repositorio-consulta-equipamento'

export class DeletaEquipamentoDB implements DeletaEquipamento {
  constructor (private readonly repositorioConsultaEquipamento: RepositorioConsultaEquipamento) {}

  async deletar (id: number): Promise<string | null> {
    await this.repositorioConsultaEquipamento.consultar(id)
    return await new Promise(resolve => resolve(null))
  }
}
