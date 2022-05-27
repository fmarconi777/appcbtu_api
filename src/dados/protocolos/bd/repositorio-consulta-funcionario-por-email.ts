import { ModeloFuncionario } from '../../../dominio/modelos/funcionario'

export interface RepositorioConsultaFuncionarioPorEmail {
  consultaPorEmail: (email: string) => Promise<ModeloFuncionario> | null
}
