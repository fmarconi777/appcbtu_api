import { ModeloFuncionario } from '../../../dominio/modelos/cadastrofuncionario'

export interface RepositorioConsultaFuncionarioPorEmail {
  consulta: (email: string) => Promise<ModeloFuncionario>
}
