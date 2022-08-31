import { ModeloFuncionario } from '../../../../dominio/modelos/funcionario'

export interface ConsultaFuncionarioPorNome {
  consultarPorNome: (nome: string) => Promise<ModeloFuncionario | null>
}
