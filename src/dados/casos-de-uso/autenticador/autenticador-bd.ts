import { Autenticador, ModeloAutenticacao } from '@/dominio/casos-de-uso/autenticador/autenticador'
import { RepositorioConsultaFuncionarioPorEmail } from '@/dados/protocolos/bd/funcionario/repositorio-consulta-funcionario-por-email'
import { ComparadorHash } from '@/dados/protocolos/criptografia/comparador-hash'
import { Encriptador } from '@/dados/protocolos/criptografia/encriptador'

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
    const funcionario = await this.repositorioConsultaFuncionarioPorEmail.consultarPorEmail(autenticacao.email)
    if (funcionario) { // eslint-disable-line
      const coincide = await this.comparadorHash.comparar(autenticacao.senha, funcionario.senha)
      if (coincide) {
        return await this.encriptador.encriptar(funcionario.id)
      }
    }
    return null
  }
}
