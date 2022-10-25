import { ConsultaEquipamento } from '@/dominio/casos-de-uso/equipamento/consulta-equipamento'
import { ModeloEquipamento } from '@/dominio/modelos/equipamento'
import { RepositorioConsultaEquipamento } from '@/dados/protocolos/bd/equipamento/repositorio-consulta-equipamento'

export class ConsultaEquipamentoBD implements ConsultaEquipamento {
  constructor (private readonly repositorioConsultaEquipamento: RepositorioConsultaEquipamento) {}

  async consultarTodos (): Promise<ModeloEquipamento[]> {
    return await this.repositorioConsultaEquipamento.consultar()
  }

  async consultar (id: number): Promise<null | ModeloEquipamento> {
    return await this.repositorioConsultaEquipamento.consultar(id)
  }
}
