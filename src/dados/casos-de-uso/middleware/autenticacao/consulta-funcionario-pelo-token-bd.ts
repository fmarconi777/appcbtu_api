import { ConsultaFuncionarioPeloToken } from '@/dominio/casos-de-uso/middleware/autenticacao/consulta-funcionario-por-token'
import { ModeloFuncionario } from '@/dominio/modelos/funcionario'
import { RepositorioConsultaFuncionarioPorId } from '@/dados/protocolos/bd/funcionario/repositorio-consulta-funcionario-por-id'
import { Decriptador } from '@/dados/protocolos/criptografia/decriptador'

export class ConsultaFuncionarioPeloTokenBd implements ConsultaFuncionarioPeloToken {
  constructor (
    private readonly decriptador: Decriptador,
    private readonly repositorioConsultaFuncionarioPorId: RepositorioConsultaFuncionarioPorId
  ) {}

  async consultar (tokenDeAcesso: string, nivel?: string | undefined): Promise<ModeloFuncionario | null> {
    const payload: any = await this.decriptador.decriptar(tokenDeAcesso)
    if (payload) { //eslint-disable-line
      const funcionario = await this.repositorioConsultaFuncionarioPorId.consultarPorId(payload.id, nivel)
      if (funcionario) { //eslint-disable-line
        return funcionario
      }
    }
    return null
  }
}
