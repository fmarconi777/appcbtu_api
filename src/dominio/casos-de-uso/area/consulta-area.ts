import { ModeloArea } from '../../modelos/area'

export interface ConsultaArea {
  consultarTodas: () => Promise<ModeloArea[]>

  consultar: (parametro: string) => Promise<ModeloArea | null>
}
