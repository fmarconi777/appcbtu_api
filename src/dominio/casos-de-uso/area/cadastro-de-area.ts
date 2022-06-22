import { ModeloArea } from '../../modelos/area'

export interface CadastroArea {
  inserir: (nome: string) => Promise<ModeloArea | string>
}
