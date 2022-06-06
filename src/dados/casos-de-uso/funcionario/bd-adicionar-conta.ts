import { CadastroDeFuncionario, InserirModeloFuncionario } from '../../../dominio/casos-de-uso/funcionario/cadastro-de-funcionario'
import { ModeloFuncionario } from '../../../dominio/modelos/funcionario'
import { GeradorDeHash } from '../../protocolos/criptografia/gerador-de-hash'
import { RepositorioFuncionario } from '../../protocolos/bd/repositorio-funcionario'
import { RepositorioConsultaFuncionarioPorEmail } from '../../protocolos/bd/repositorio-consulta-funcionario-por-email'

export class BdAdicionarConta implements CadastroDeFuncionario {
  private readonly geradorDeHash: GeradorDeHash
  private readonly repositorioFuncionario: RepositorioFuncionario
  private readonly repositorioConsultaFuncionarioPorEmail: RepositorioConsultaFuncionarioPorEmail

  constructor (geradorDeHash: GeradorDeHash, RepositorioFuncionario: RepositorioFuncionario, repositorioConsultaFuncionarioPorEmail: RepositorioConsultaFuncionarioPorEmail) {
    this.geradorDeHash = geradorDeHash
    this.repositorioFuncionario = RepositorioFuncionario
    this.repositorioConsultaFuncionarioPorEmail = repositorioConsultaFuncionarioPorEmail
  }

  async adicionar (contaData: InserirModeloFuncionario): Promise<ModeloFuncionario | null> {
    await this.repositorioConsultaFuncionarioPorEmail.consultaPorEmail(contaData.email)
    const senhaHashed = await this.geradorDeHash.gerar(contaData.senha)
    const conta = await this.repositorioFuncionario.adicionar(Object.assign({}, contaData, { senha: senhaHashed }))
    return Object.assign({}, conta, { senha: undefined })
  }
}
