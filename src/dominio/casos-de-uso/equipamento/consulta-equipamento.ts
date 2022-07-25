import { ModeloEquipamento } from '../../modelos/equipamento'

export interface ConsultaEquipamento {
  consultarTodos: () => Promise<ModeloEquipamento[]>

  consultar: (id: number) => Promise<ModeloEquipamento | null>
}
