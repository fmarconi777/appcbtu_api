import { CadastroDeFuncionario, InserirModeloFuncionario } from '../../../dominio/casos-de-uso/funcionario/cadastro-de-funcionario'
import { ModeloFuncionario } from '../../../dominio/modelos/funcionario'
import { Encriptador } from '../../protocolos/criptografia/encriptador'
import { RepositorioFuncionario } from '../../protocolos/bd/repositorio-funcionario'

export class BdAdicionarConta implements CadastroDeFuncionario {
  private readonly encriptar: Encriptador
  private readonly repositorioFuncionario: RepositorioFuncionario
  constructor (encriptar: Encriptador, RepositorioFuncionario: RepositorioFuncionario) {
    this.encriptar = encriptar
    this.repositorioFuncionario = RepositorioFuncionario
  }

  async adicionar (contaData: InserirModeloFuncionario): Promise<ModeloFuncionario> {
    const senhaHashed = await this.encriptar.encriptar(contaData.senha)
    const conta = await this.repositorioFuncionario.adicionar(Object.assign({}, contaData, { senha: senhaHashed }))
    return conta
  }
}
