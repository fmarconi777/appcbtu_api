import { ModeloFuncionario } from '../../modelos/funcionario'

export interface ConsultaFuncionarioPeloToken {
  consultar: (tokenDeAcesso: string, nivel?: string) => Promise<ModeloFuncionario | null>
}
