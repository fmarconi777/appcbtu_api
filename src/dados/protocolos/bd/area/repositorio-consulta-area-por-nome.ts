import { ModeloArea } from '../../../../dominio/modelos/area'

export interface ConsultaAreaPorNome {
  consultaPorNome: (nome: string) => Promise<ModeloArea | null>
}
