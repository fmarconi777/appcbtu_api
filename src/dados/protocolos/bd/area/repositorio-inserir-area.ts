import { ModeloArea } from '../../../../dominio/modelos/area'

export interface RepositorioInserirArea {
  inserir: (id: number, nome: string) => Promise<ModeloArea>
}
