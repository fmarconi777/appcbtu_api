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

interface SubTipos {
  sut: CadastroDeTelefoneBD
  validaEstacaoStub: ValidadorBD
}

const makeSut = (): SubTipos => {
  const validaEstacaoStub = makeValidaEstacaoStub()
  const sut = new CadastroDeTelefoneBD(validaEstacaoStub)
  return {
    sut,
    validaEstacaoStub
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
})
