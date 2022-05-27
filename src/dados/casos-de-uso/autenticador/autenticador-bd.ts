import { Autenticador, ModeloAutenticacao } from '../../../dominio/casos-de-uso/autenticador/autenticador'
import { RepositorioConsultaFuncionarioPorEmail } from '../../protocolos/bd/repositorio-consulta-funcionario-por-email'
import { ComparadorHash } from '../../protocolos/criptografia/comparador-hash'
import { Encriptador } from '../../protocolos/criptografia/encriptador'

export class AutenticadorBD implements Autenticador {
  private readonly repositorioConsultaFuncionarioPorEmail: RepositorioConsultaFuncionarioPorEmail
  private readonly comparadorHash: ComparadorHash
  private readonly encriptador: Encriptador

  constructor (repositorioConsultaFuncionarioPorEmail: RepositorioConsultaFuncionarioPorEmail, comparadorHash: ComparadorHash, encriptador: Encriptador) {
    this.repositorioConsultaFuncionarioPorEmail = repositorioConsultaFuncionarioPorEmail
    this.comparadorHash = comparadorHash
    this.encriptador = encriptador
  }

  async autenticar (autenticacao: ModeloAutenticacao): Promise<string | null> {
    const funcionario = await this.repositorioConsultaFuncionarioPorEmail.consulta(autenticacao.email)
    if (funcionario) { // eslint-disable-line
      const coincide = await this.comparadorHash.comparar(autenticacao.senha, funcionario.senha)
      if (coincide) {
        return await this.encriptador.encriptar(funcionario.id)
      }
    }
    return null
  }
}
