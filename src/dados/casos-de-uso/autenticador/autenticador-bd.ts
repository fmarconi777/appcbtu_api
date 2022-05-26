import { Autenticador, ModeloAutenticacao } from '../../../dominio/casos-de-uso/autenticador/autenticador'
import { RepositorioConsultaFuncionarioPorEmail } from '../../protocolos/bd/repositorio-consulta-funcionario-por-email'
import { ComparadorHash } from '../../protocolos/criptografia/comparador-hash'
import { GeradorDeToken } from '../../protocolos/criptografia/gerador-de-token'

export class AutenticadorBD implements Autenticador {
  private readonly repositorioConsultaFuncionarioPorEmail: RepositorioConsultaFuncionarioPorEmail
  private readonly comparadorHash: ComparadorHash
  private readonly geradorDeToken: GeradorDeToken

  constructor (repositorioConsultaFuncionarioPorEmail: RepositorioConsultaFuncionarioPorEmail, comparadorHash: ComparadorHash, geradorDeToken: GeradorDeToken) {
    this.repositorioConsultaFuncionarioPorEmail = repositorioConsultaFuncionarioPorEmail
    this.comparadorHash = comparadorHash
    this.geradorDeToken = geradorDeToken
  }

  async autenticar (autenticacao: ModeloAutenticacao): Promise<string | null> {
    const funcionario = await this.repositorioConsultaFuncionarioPorEmail.consulta(autenticacao.email)
    if (funcionario) { // eslint-disable-line
      const comparacao = await this.comparadorHash.comparar(autenticacao.senha, funcionario.senha)
      if (comparacao) {
        return await this.geradorDeToken.gerar(funcionario.id)
      }
    }
    return null
  }
}
