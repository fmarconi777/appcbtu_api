import { DeletaEquipamento } from '../../../dominio/casos-de-uso/equipamento/deleta-equipamento'
import { RepositorioConsultaEquipamento } from '../../protocolos/bd/equipamento/repositorio-consulta-equipamento'

export class DeletaEquipamentoDB implements DeletaEquipamento {
  constructor (private readonly repositorioConsultaEquipamento: RepositorioConsultaEquipamento) {}

  async deletar (id: number): Promise<string | null> {
    const idValido = await this.repositorioConsultaEquipamento.consultar(id)
    if (idValido) { //eslint-disable-line
      return await new Promise(resolve => resolve(''))
    }
    return idValido
  }
}
