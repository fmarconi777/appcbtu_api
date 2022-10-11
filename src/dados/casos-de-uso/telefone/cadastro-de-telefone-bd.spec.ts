import { RepositorioCadastroTelefone } from '../../protocolos/bd/telefone/repositorio-cadastro-telefone'
import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'
import { CadastroDeTelefoneBD } from './cadastro-de-telefone-bd'

const numero = 3132505555
const estacaoId = 1

const makeValidaEstacaoStub = (): ValidadorBD => {
  class ValidaEstacaoStub implements ValidadorBD {
    async validar (parametro: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new ValidaEstacaoStub()
}

const makeRepositorioCadastroTelefoneStub = (): RepositorioCadastroTelefone => {
  class RepositorioCadastroTelefoneStub implements RepositorioCadastroTelefone {
    async inserir (numero: number, estacaoId: number): Promise<string> {
      return await Promise.resolve('Telefone cadastrado com sucesso')
    }
  }
  return new RepositorioCadastroTelefoneStub()
}

interface SubTipos {
  sut: CadastroDeTelefoneBD
  validaEstacaoStub: ValidadorBD
  repositorioCadastroTelefoneStub: RepositorioCadastroTelefone
}

const makeSut = (): SubTipos => {
  const repositorioCadastroTelefoneStub = makeRepositorioCadastroTelefoneStub()
  const validaEstacaoStub = makeValidaEstacaoStub()
  const sut = new CadastroDeTelefoneBD(validaEstacaoStub, repositorioCadastroTelefoneStub)
  return {
    sut,
    validaEstacaoStub,
    repositorioCadastroTelefoneStub
  }
}

describe('CadastroDeTelefoneBD', () => {
  test('Deve chamar o validaEstacao com o valor correto', async () => {
    const { sut, validaEstacaoStub } = makeSut()
    const validarSpy = jest.spyOn(validaEstacaoStub, 'validar')
    await sut.inserir(numero, estacaoId)
    expect(validarSpy).toHaveBeenCalledWith(estacaoId)
  })

  test('Deve retornar um erro caso o validaEstacao retorne erro', async () => {
    const { sut, validaEstacaoStub } = makeSut()
    jest.spyOn(validaEstacaoStub, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.inserir(numero, estacaoId)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar null caso o validaEstacao retorne false', async () => {
    const { sut, validaEstacaoStub } = makeSut()
    jest.spyOn(validaEstacaoStub, 'validar').mockReturnValueOnce(Promise.resolve(false))
    const resposta = await sut.inserir(numero, estacaoId)
    expect(resposta).toBeNull()
  })

  test('Deve chamar o repositorioCadastroTelefone com os valores corretos', async () => {
    const { sut, repositorioCadastroTelefoneStub } = makeSut()
    const inserirSpy = jest.spyOn(repositorioCadastroTelefoneStub, 'inserir')
    await sut.inserir(numero, estacaoId)
    expect(inserirSpy).toHaveBeenCalledWith(numero, estacaoId)
  })

  test('Deve retornar um erro caso o repositorioCadastroTelefone retorne erro', async () => {
    const { sut, repositorioCadastroTelefoneStub } = makeSut()
    jest.spyOn(repositorioCadastroTelefoneStub, 'inserir').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.inserir(numero, estacaoId)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar a menssagem "Telefone cadastrado com sucesso" em caso de sucesso', async () => {
    const { sut, repositorioCadastroTelefoneStub } = makeSut()
    jest.spyOn(repositorioCadastroTelefoneStub, 'inserir').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.inserir(numero, estacaoId)
    await expect(resposta).rejects.toThrow()
  })
})
