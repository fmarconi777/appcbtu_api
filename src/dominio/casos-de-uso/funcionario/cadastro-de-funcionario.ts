import { ModeloFuncionario } from '../../modelos/funcionario'

export interface InserirModeloFuncionario {
  nome: string
  email: string
  senha: string
  administrador: string
  areaId: string
}

export interface CadastroDeFuncionario {
  adicionar: (conta: InserirModeloFuncionario) => Promise<ModeloFuncionario | null>
}
