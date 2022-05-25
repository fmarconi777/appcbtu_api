import { Autenticador, ModeloAutenticacao } from '../../../dominio/casos-de-uso/autenticador/autenticador'
import { RepositorioConsultaContaPorEmail } from '../../protocolos/repositorio-consulta-conta-por-email'

export class AutenticadorBD implements Autenticador {
  private readonly repositorioConsultaContaPorEmail: RepositorioConsultaContaPorEmail

  constructor (repositorioConsultaContaPorEmail: RepositorioConsultaContaPorEmail) {
    this.repositorioConsultaContaPorEmail = repositorioConsultaContaPorEmail
  }

  async autenticar (autenticacao: ModeloAutenticacao): Promise<string> {
    await this.repositorioConsultaContaPorEmail.consulta(autenticacao.email)
    return await new Promise(resolve => resolve(''))
  }
}
