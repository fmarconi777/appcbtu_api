import { ModeloFuncionario } from '../../dominio/modelos/cadastrofuncionario'

export interface RepositorioConsultaContaPorEmail {
  consulta: (email: string) => Promise<ModeloFuncionario>
}
