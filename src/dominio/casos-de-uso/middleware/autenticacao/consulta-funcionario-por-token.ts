import { ModeloFuncionario } from '@/dominio/modelos/funcionario'

export interface ConsultaFuncionarioPeloToken {
  consultar: (tokenDeAcesso: string, nivel?: string) => Promise<ModeloFuncionario | null>
}
