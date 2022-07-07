import { ModeloEquipamento } from '../../../../dominio/modelos/equipamento'

export interface RepositorioConsultaEquipamento {
  consultar: (id?: number) => Promise<ModeloEquipamento | ModeloEquipamento[] | any>
}
