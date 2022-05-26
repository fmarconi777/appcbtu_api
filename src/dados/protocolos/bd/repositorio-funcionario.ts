import { InserirModeloFuncionario } from '../../../dominio/casos-de-uso/funcionario/cadastro-de-funcionario'
import { ModeloFuncionario } from '../../../dominio/modelos/funcionario'
export interface RepositorioFuncionario {
  adicionar: (contaData: InserirModeloFuncionario) => Promise<ModeloFuncionario>
}
