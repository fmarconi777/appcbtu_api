import { ModeloArea } from '@/dominio/modelos/area'

export interface ConsultaAreaPorId {
  consultarPorId: (id: number) => Promise<ModeloArea | null>
}
