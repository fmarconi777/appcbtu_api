import { Autenticador, ModeloAutenticacao } from '../../../dominio/casos-de-uso/autenticador/autenticador'
import { RepositorioConsultaFuncionarioPorEmail } from '../../protocolos/bd/repositorio-consulta-funcionario-por-email'
import { ComparadorHash } from '../../protocolos/criptografia/comparador-hash'

export class AutenticadorBD implements Autenticador {
  private readonly repositorioConsultaFuncionarioPorEmail: RepositorioConsultaFuncionarioPorEmail
  private readonly comparadorHash: ComparadorHash

  constructor (repositorioConsultaFuncionarioPorEmail: RepositorioConsultaFuncionarioPorEmail, comparadorHash: ComparadorHash) {
    this.repositorioConsultaFuncionarioPorEmail = repositorioConsultaFuncionarioPorEmail
    this.comparadorHash = comparadorHash
  }

  async autenticar (autenticacao: ModeloAutenticacao): Promise<string | null> {
    const funcionario = await this.repositorioConsultaFuncionarioPorEmail.consulta(autenticacao.email)
    if (funcionario) { // eslint-disable-line
      const comparacao = await this.comparadorHash.comparar(autenticacao.senha, funcionario.senha)
      if (comparacao) {
        return await new Promise(resolve => resolve(''))
      }
    }
    return null
  }
}
