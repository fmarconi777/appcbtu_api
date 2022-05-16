import { InserirModeloFuncionario } from '../../dominio/casos-de-uso/adicionarconta/cadastro-de-funcionario'
import { ModeloFuncionario } from '../../dominio/modelos/cadastrofuncionario'
export interface AdicionarContaRepositorio {
  adicionar: (contaData: InserirModeloFuncionario) => Promise<ModeloFuncionario>
}
