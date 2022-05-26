import { ModeloFuncionario } from '../../../dominio/modelos/funcionario'

export interface RepositorioConsultaFuncionarioPorEmail {
  consulta: (email: string) => Promise<ModeloFuncionario> | null
}
