import { DeletaAreaBD } from './deleta-area-bd'
import { RepositorioDeletaArea } from '@/dados/protocolos/bd/area/repositorio-deleta-area'
import { ValidadorBD } from '@/dados/protocolos/utilidades/validadorBD'

const makeRepositorioArea = (): RepositorioDeletaArea => {
  class RepositorioDeletaAreaStub implements RepositorioDeletaArea {
    async deletar (nome: string): Promise<string> {
      return await new Promise(resolve => resolve('Área deletada com sucesso'))
    }
  }
  return new RepositorioDeletaAreaStub()
}

const makeValidaAreaStub = (): ValidadorBD => {
  class ValidaAreaStub implements ValidadorBD {
    async validar (parametro: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new ValidaAreaStub()
}

interface SubTipo {
  sut: DeletaAreaBD
  validaAreaStub: ValidadorBD
  repositorioDeletaAreaStub: RepositorioDeletaArea
}

const makeSut = (): SubTipo => {
  const repositorioDeletaAreaStub = makeRepositorioArea()
  const validaAreaStub = makeValidaAreaStub()
  const sut = new DeletaAreaBD(validaAreaStub, repositorioDeletaAreaStub)
  return {
    sut,
    validaAreaStub,
    repositorioDeletaAreaStub
  }
}

describe('DeletaAreaBD', () => {
  test('Deve chamar o validaArea com o valor correto', async () => {
    const { sut, validaAreaStub } = makeSut()
    const validarSpy = jest.spyOn(validaAreaStub, 'validar')
    await sut.deletar('AREA_QUALQUER')
    expect(validarSpy).toHaveBeenCalledWith('AREA_QUALQUER')
  })

  test('Deve retornar um erro caso o validaArea retorne um erro', async () => {
    const { sut, validaAreaStub } = makeSut()
    jest.spyOn(validaAreaStub, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.deletar('AREA_QUALQUER')
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar null caso o validaArea retorne false', async () => {
    const { sut, validaAreaStub } = makeSut()
    jest.spyOn(validaAreaStub, 'validar').mockReturnValueOnce(Promise.resolve(false))
    const resposta = await sut.deletar('AREA_QUALQUER')
    expect(resposta).toBeNull()
  })

  test('Deve chamar o RepositorioArea com o valor correto', async () => {
    const { sut, repositorioDeletaAreaStub } = makeSut()
    const deletarSpy = jest.spyOn(repositorioDeletaAreaStub, 'deletar')
    await sut.deletar('AREA_QUALQUER')
    expect(deletarSpy).toHaveBeenCalledWith('AREA_QUALQUER')
  })

  test('Deve retornar a mensagem "Área deletada com sucesso" em caso de sucesso', async () => {
    const { sut } = makeSut()
    const resposta = await sut.deletar('AREA_QUALQUER')
    expect(resposta).toBe('Área deletada com sucesso')
  })

  test('Deve retornar um erro caso o RepositorioArea retorne um erro', async () => {
    const { sut, repositorioDeletaAreaStub } = makeSut()
    jest.spyOn(repositorioDeletaAreaStub, 'deletar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.deletar('AREA_QUALQUER')
    await expect(resposta).rejects.toThrow()
  })
})
