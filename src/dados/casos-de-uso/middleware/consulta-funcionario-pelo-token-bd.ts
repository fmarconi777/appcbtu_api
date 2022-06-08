import { ConsultaFuncionarioPeloToken } from '../../../dominio/casos-de-uso/middleware/consulta-funcionario-por-token'
import { ModeloFuncionario } from '../../../dominio/modelos/funcionario'
import { Decriptador } from '../../protocolos/criptografia/decriptador'

export class ConsultaFuncionarioPeloTokenBd implements ConsultaFuncionarioPeloToken {
  constructor (private readonly decriptador: Decriptador) {}

  async consultar (tokenDeAcesso: string, nivel?: string | undefined): Promise<ModeloFuncionario | null> {
    await this.decriptador.decriptar(tokenDeAcesso)
    return null
  }
}
