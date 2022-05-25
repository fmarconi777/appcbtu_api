import { Encriptador } from '../../../apresentacao/protocolos/encriptador'
import { BdAdicionarConta } from './bd-adicionar-conta'
import { InserirModeloFuncionario, RepositorioFuncionario } from './bd-adicionar-conta-protocolos'
import { ModeloFuncionario } from '../../../dominio/modelos/cadastrofuncionario'

const makeEncriptador = (): Encriptador => {
  class EncriptadorStub implements Encriptador {
    async encriptar (value: string): Promise<string> {
      return await new Promise(resolve => resolve('senha_hashed'))
    }
  }
  return new EncriptadorStub()
}

const makeRepositorioFuncionario = (): RepositorioFuncionario => {
  class RepositorioFuncionarioStub implements RepositorioFuncionario {
    async adicionar (contaData: InserirModeloFuncionario): Promise<ModeloFuncionario> {
      const contafalsa = {
        id: 'id_valido',
        nome: 'nome_valido',
        email: 'email_valido',
        senha: 'senha_hashed',
        administrador: 'administrador_valido',
        areaId: 'areaid_valido'

      }
      return await new Promise(resolve => resolve(contafalsa))
    }
  }
  return new RepositorioFuncionarioStub()
}
interface SutTipos {
  sut: BdAdicionarConta
  encriptadorStub: Encriptador
  repositorioFuncionarioStub: RepositorioFuncionario
}

const makeSut = (): SutTipos => {
  const encriptadorStub = makeEncriptador()
  const repositorioFuncionarioStub = makeRepositorioFuncionario()
  const sut = new BdAdicionarConta(encriptadorStub, repositorioFuncionarioStub)
  return {
    sut,
    encriptadorStub,
    repositorioFuncionarioStub
  }
}

describe('CasodeUso BdAdicionarConta', () => {
  test('Deverá chamar o Encriptador com a senha correta', async () => {
    const { sut, encriptadorStub } = makeSut()
    const encriptarEspionar = jest.spyOn(encriptadorStub, 'encriptar')
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    }
    await sut.adicionar(dataConta)
    expect(encriptarEspionar).toHaveBeenCalledWith('senha_valido')
  })
  test('Deverá jogar o Encriptador se ele estiver na condiçao de throw', async () => {
    const { sut, encriptadorStub } = makeSut()
    jest.spyOn(encriptadorStub, 'encriptar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    }
    const promise = sut.adicionar(dataConta)
    await expect(promise).rejects.toThrow()
  })
  test('Deverá chamar o AdicionarContaRepositorio com os valores corretos', async () => {
    const { sut, repositorioFuncionarioStub } = makeSut()
    const adicionarEspionar = jest.spyOn(repositorioFuncionarioStub, 'adicionar')
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    }
    await sut.adicionar(dataConta)
    expect(adicionarEspionar).toHaveBeenCalledWith({
      nome: 'nome_valido',
      email: 'email_valido',
      senha: 'senha_hashed',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    })
  })
  test('Deverá jogar o Encriptador se o AdicionarContaRepositorio estiver na condiçao de throw', async () => {
    const { sut, repositorioFuncionarioStub } = makeSut()
    jest.spyOn(repositorioFuncionarioStub, 'adicionar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    }
    const promise = sut.adicionar(dataConta)
    await expect(promise).rejects.toThrow()
  })
  test('Deverá retornar uma conta se der sucesso', async () => {
    const { sut } = makeSut()
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    }
    const conta = await sut.adicionar(dataConta)
    expect(conta).toEqual({
      id: 'id_valido',
      nome: 'nome_valido',
      email: 'email_valido',
      senha: 'senha_hashed',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    })
  })
})
