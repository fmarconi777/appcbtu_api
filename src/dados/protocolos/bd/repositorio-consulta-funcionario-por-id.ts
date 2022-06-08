import { ModeloFuncionario } from '../../../dominio/modelos/funcionario'

export interface RepositorioConsultaFuncionarioPorId {
  consultarPorId: (id: string, nivel?: string) => Promise<ModeloFuncionario | null>
}
