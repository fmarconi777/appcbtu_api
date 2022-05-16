import { AdicionarConta, InserirModeloFuncionario } from '../../../dominio/casos-de-uso/adicionarconta/cadastro-de-funcionario'
import { ModeloFuncionario } from '../../../dominio/modelos/cadastrofuncionario'
import { Encriptador } from '../../../apresentacao/protocolos/encriptador'
import { AdicionarContaRepositorio } from '../../protocolos/repositorio-funcionario'

export class BdAdicionarConta implements AdicionarConta {
  private readonly encriptar: Encriptador
  private readonly adicionarContaRepositorio: AdicionarContaRepositorio
  constructor (encriptar: Encriptador, adicionarContaRepositorio: AdicionarContaRepositorio) {
    this.encriptar = encriptar
    this.adicionarContaRepositorio = adicionarContaRepositorio
  }

  async adicionar (contaData: InserirModeloFuncionario): Promise<ModeloFuncionario> {
    const senhaHashed = await this.encriptar.encriptar(contaData.senha)
    const conta = await this.adicionarContaRepositorio.adicionar(Object.assign({}, contaData, { senha: senhaHashed }))
    return conta
  }
}
