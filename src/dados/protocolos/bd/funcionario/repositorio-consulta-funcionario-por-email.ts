import { ModeloFuncionario } from '../../../../dominio/modelos/funcionario'

export interface RepositorioConsultaFuncionarioPorEmail {
  consultarPorEmail: (email: string) => Promise<ModeloFuncionario | null>
}
