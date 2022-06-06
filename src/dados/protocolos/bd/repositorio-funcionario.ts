import { InserirModeloFuncionario } from '../../../dominio/casos-de-uso/funcionario/cadastro-de-funcionario'
import { ModeloFuncionario } from '../../../dominio/modelos/funcionario'

export { InserirModeloFuncionario, ModeloFuncionario }

export interface RepositorioFuncionario {
  adicionar: (contaData: InserirModeloFuncionario) => Promise<ModeloFuncionario>
}
