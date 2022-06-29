import { RepositorioDeletaArea } from '../../protocolos/bd/area/repositorio-deleta-area'
import { DeletaAreaBD } from './deleta-area-bd'

const makeRepositorioArea = (): RepositorioDeletaArea => {
  class RepositorioDeletaAreaStub implements RepositorioDeletaArea {
    async deletar (nome: string): Promise<string> {
      return await new Promise(resolve => resolve('Área deletada com sucesso'))
    }
  }
  return new RepositorioDeletaAreaStub()
}

interface SubTipo {
  sut: DeletaAreaBD
  repositorioDeletaAreaStub: RepositorioDeletaArea
}

const makeSut = (): SubTipo => {
  const repositorioDeletaAreaStub = makeRepositorioArea()
  const sut = new DeletaAreaBD(repositorioDeletaAreaStub)
  return {
    sut,
    repositorioDeletaAreaStub
  }
}

describe('DeletaAreaBD', () => {
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
