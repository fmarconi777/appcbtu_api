import { ModeloArea } from '../../../../dominio/modelos/area'

export interface RepositorioInserirArea {
  inserir: (nome: string) => Promise<ModeloArea>
}
