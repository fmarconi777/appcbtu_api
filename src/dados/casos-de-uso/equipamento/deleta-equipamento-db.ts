import { DeletaEquipamento } from '../../../dominio/casos-de-uso/equipamento/deleta-equipamento'
import { RepositorioConsultaEquipamento } from '../../protocolos/bd/equipamento/repositorio-consulta-equipamento'
import { RepositorioDeletaEquipamento } from '../../protocolos/bd/equipamento/repositorio-deleta-equipamento'

export class DeletaEquipamentoDB implements DeletaEquipamento {
  constructor (
    private readonly repositorioConsultaEquipamento: RepositorioConsultaEquipamento,
    private readonly repositorioDeletaEquipamentoStub: RepositorioDeletaEquipamento
  ) {}

  async deletar (id: number): Promise<string | null> {
    const idValido = await this.repositorioConsultaEquipamento.consultar(id)
    if (idValido) { //eslint-disable-line
      await this.repositorioDeletaEquipamentoStub.deletar(id)
      return await new Promise(resolve => resolve(''))
    }
    return idValido
  }
}
