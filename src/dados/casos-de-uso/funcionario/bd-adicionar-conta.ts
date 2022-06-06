import { CadastroDeFuncionario, InserirModeloFuncionario } from '../../../dominio/casos-de-uso/funcionario/cadastro-de-funcionario'
import { ModeloFuncionario } from '../../../dominio/modelos/funcionario'
import { GeradorDeHash } from '../../protocolos/criptografia/gerador-de-hash'
import { RepositorioFuncionario } from '../../protocolos/bd/repositorio-funcionario'

export class BdAdicionarConta implements CadastroDeFuncionario {
  private readonly geradorDeHash: GeradorDeHash
  private readonly repositorioFuncionario: RepositorioFuncionario
  constructor (geradorDeHash: GeradorDeHash, RepositorioFuncionario: RepositorioFuncionario) {
    this.geradorDeHash = geradorDeHash
    this.repositorioFuncionario = RepositorioFuncionario
  }

  async adicionar (contaData: InserirModeloFuncionario): Promise<ModeloFuncionario> {
    const senhaHashed = await this.geradorDeHash.gerar(contaData.senha)
    const conta = await this.repositorioFuncionario.adicionar(Object.assign({}, contaData, { senha: senhaHashed }))
    return Object.assign({}, conta, { senha: undefined })
  }
}
