import { Encriptador } from '../../../apresentacao/protocolos/encriptador'
import { BdAdicionarConta } from './bd-adicionar-conta'
import { InserirModeloFuncionario, AdicionarContaRepositorio } from './bd-adicionar-conta-protocolos'
import { ModeloFuncionario } from '../../../dominio/modelos/cadastrofuncionario'

const makeEncriptador = (): Encriptador => {
  class EncriptadorStub implements Encriptador {
    async encriptar (value: string): Promise<string> {
      return await new Promise(resolve => resolve('senha_hashed'))
    }
  }
  return new EncriptadorStub()
}

const makeAdicionarContaRepositorio = (): AdicionarContaRepositorio => {
  class AdicionarContarRepositorioStub implements AdicionarContarRepositorioStub {
    async adicionar (contaData: InserirModeloFuncionario): Promise<ModeloFuncionario> {
      const contafalsa = {
        id: 'id_valido',
        nome: 'nome_valido',
        email: 'email_valido',
        area: 'area_valido',
        senha: 'senha_hashed',
        administrador: 'administrador_valido',
        areaId: 'areaid_valido',
        confirmarSenha: 'confirmarsenha_valido'

      }
      return await new Promise(resolve => resolve(contafalsa))
    }
  }
  return new AdicionarContarRepositorioStub()
}
interface SutTipos {
  sut: BdAdicionarConta
  encriptadorStub: Encriptador
  adicionarContaRepositorioStub: AdicionarContaRepositorio
}

const makeSut = (): SutTipos => {
  const encriptadorStub = makeEncriptador()
  const adicionarContaRepositorioStub = makeAdicionarContaRepositorio()
  const sut = new BdAdicionarConta(encriptadorStub, adicionarContaRepositorioStub)
  return {
    sut,
    encriptadorStub,
    adicionarContaRepositorioStub
  }
}

describe('CasodeUso BdAdicionarConta', () => {
  test('Deverá chamar o Encriptador com a senha correta', async () => {
    const { sut, encriptadorStub } = makeSut()
    const encriptarEspionar = jest.spyOn(encriptadorStub, 'encriptar')
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido',
      area: 'area_valido',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido',
      confirmarSenha: 'confirmarsenha_valido'
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
      area: 'area_valido',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido',
      confirmarSenha: 'confirmarsenha_valido'
    }
    const promise = sut.adicionar(dataConta)
    await expect(promise).rejects.toThrow()
  })
  test('Deverá chamar o AdicionarContaRepositorio com os valores corretos', async () => {
    const { sut, adicionarContaRepositorioStub } = makeSut()
    const adicionarEspionar = jest.spyOn(adicionarContaRepositorioStub, 'adicionar')
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido',
      area: 'area_valido',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido',
      confirmarSenha: 'confirmarsenha_valido'
    }
    await sut.adicionar(dataConta)
    expect(adicionarEspionar).toHaveBeenCalledWith({
      nome: 'nome_valido',
      email: 'email_valido',
      area: 'area_valido',
      senha: 'senha_hashed',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido',
      confirmarSenha: 'confirmarsenha_valido'
    })
  })
  test('Deverá jogar o Encriptador se o AdicionarContaRepositorio estiver na condiçao de throw', async () => {
    const { sut, adicionarContaRepositorioStub } = makeSut()
    jest.spyOn(adicionarContaRepositorioStub, 'adicionar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido',
      area: 'area_valido',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido',
      confirmarSenha: 'confirmarsenha_valido'
    }
    const promise = sut.adicionar(dataConta)
    await expect(promise).rejects.toThrow()
  })
})
