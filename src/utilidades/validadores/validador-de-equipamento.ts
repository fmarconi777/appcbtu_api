import { ValidadorBD } from '../../apresentacao/protocolos/validadorBD'
import { ConsultaEquipamento } from '../../dominio/casos-de-uso/equipamento/consulta-equipamento'

export class ValidadorDeEquipamento implements ValidadorBD {
  constructor (private readonly consultaEquipamento: ConsultaEquipamento) {}

  async validar (parametro: number): Promise<boolean> {
    const listaEquipamento = await this.consultaEquipamento.consultarTodos()
    return listaEquipamento.some(equipamento => +equipamento.id === parametro)
  }
}
