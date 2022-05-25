import { Autenticador, ModeloAutenticacao } from '../../../dominio/casos-de-uso/autenticador/autenticador'
import { RepositorioConsultaFuncionarioPorEmail } from '../../protocolos/repositorio-consulta-conta-por-email'

export class AutenticadorBD implements Autenticador {
  private readonly repositorioConsultaFuncionarioPorEmail: RepositorioConsultaFuncionarioPorEmail

  constructor (repositorioConsultaFuncionarioPorEmail: RepositorioConsultaFuncionarioPorEmail) {
    this.repositorioConsultaFuncionarioPorEmail = repositorioConsultaFuncionarioPorEmail
  }

  async autenticar (autenticacao: ModeloAutenticacao): Promise<string> {
    await this.repositorioConsultaFuncionarioPorEmail.consulta(autenticacao.email)
    return await new Promise(resolve => resolve(''))
  }
}
