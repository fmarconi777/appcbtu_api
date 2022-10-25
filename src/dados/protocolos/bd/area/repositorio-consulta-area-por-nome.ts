import { ModeloArea } from '@/dominio/modelos/area'

export interface ConsultaAreaPorNome {
  consultarPorNome: (nome: string) => Promise<ModeloArea | null>
}
