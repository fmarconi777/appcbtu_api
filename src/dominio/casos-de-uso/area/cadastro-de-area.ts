import { ModeloArea } from '../../modelos/area'

export interface CadastroArea {
  inserir: (nome: string, id: number) => Promise<ModeloArea | string>
}
