import { ModeloFuncionario } from '../../modelos/cadastrofuncionario'

export interface InserirModeloFuncionario {
  nome: string
  area: string
  email: string
  senha: string
  confirmarSenha: string
}

export interface AdicionarConta {
  adicionar: (conta: InserirModeloFuncionario) => Promise<ModeloFuncionario>
}
