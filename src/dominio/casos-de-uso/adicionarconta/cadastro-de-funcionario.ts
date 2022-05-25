import { ModeloFuncionario } from '../../modelos/cadastrofuncionario'

export interface InserirModeloFuncionario {
  nome: string
  email: string
  senha: string
  administrador: string
  areaId: string
}

export interface CadastroDeFuncionario {
  adicionar: (conta: InserirModeloFuncionario) => Promise<ModeloFuncionario>
}
