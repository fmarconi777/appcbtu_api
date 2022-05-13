import { Encriptador } from '../../../apresentacao/protocolos/encriptador'
import { BdAdicionarConta } from './bd-adicionar-conta'

interface SutTipos {
  sut: BdAdicionarConta
  encriptadorStub: Encriptador
}

const makeEncriptador = (): Encriptador => {
  class EncriptadorStub implements Encriptador {
    async encriptar (value: string): Promise<string> {
      return await new Promise(resolve => resolve('senha_hashed'))
    }
  }
  return new EncriptadorStub()
}

const makeSut = (): SutTipos => {
  const encriptadorStub = makeEncriptador()
  const sut = new BdAdicionarConta(encriptadorStub)
  return {
    sut,
    encriptadorStub
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
      confirmarSenha: 'confirmarsenha_valido'
    }
    const promise = sut.adicionar(dataConta)
    await expect(promise).rejects.toThrow()
  })
})
