import { ConsultaEquipamento } from '@/dominio/casos-de-uso/equipamento/consulta-equipamento'
import { ValidadorBD } from '@/dados/protocolos/utilidades/validadorBD'

export class ValidadorDeEquipamento implements ValidadorBD {
  constructor (private readonly consultaEquipamento: ConsultaEquipamento) {}

  async validar (id: number): Promise<boolean> {
    const listaEquipamento = await this.consultaEquipamento.consultarTodos()
    return listaEquipamento.some(equipamento => +equipamento.id === id)
  }
}
