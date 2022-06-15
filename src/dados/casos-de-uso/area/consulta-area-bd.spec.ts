import { ConsultaAreaBD } from './consulta-area-bd'
import { RepositorioArea, ModelosAreas } from '../../protocolos/bd/repositorio-area'
import { ModeloArea } from '../../../dominio/modelos/area'

const makeAreaFalsa = (): ModeloArea => ({
  id: 'id_qualquer',
  nome: 'AREA_QUALQUER'
})

const makeRepositorioArea = (): RepositorioArea => {
  class RepositorioAreaStub implements RepositorioArea {
    async consultar (area?: string): Promise<ModelosAreas> {
      if (area) { //eslint-disable-line
        return await new Promise(resolve => resolve(makeAreaFalsa()))
      }
      return await new Promise(resolve => resolve([makeAreaFalsa()]))
    }
  }
  return new RepositorioAreaStub()
}

interface SubTipo {
  sut: ConsultaAreaBD
  repositorioAreaStub: RepositorioArea
}

const makeSut = (): SubTipo => {
  const repositorioAreaStub = makeRepositorioArea()
  const sut = new ConsultaAreaBD(repositorioAreaStub)
  return {
    sut,
    repositorioAreaStub
  }
}

describe('ConsultaAreaBD', () => {
  test('Deve chamar o RepositorioArea com o valor correto', async () => {
    const { sut, repositorioAreaStub } = makeSut()
    const consultarSpy = jest.spyOn(repositorioAreaStub, 'consultar')
    const area = 'AREA_QUALQUER'
    await sut.consultar(area)
    expect(consultarSpy).toHaveBeenCalledWith('AREA_QUALQUER')
  })

  test('Método consultar deve retornar um erro caso o RepositorioArea retorne um erro', async () => {
    const { sut, repositorioAreaStub } = makeSut()
    jest.spyOn(repositorioAreaStub, 'consultar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const area = 'AREA_QUALQUER'
    const respostaConsultar = sut.consultar(area)
    await expect(respostaConsultar).rejects.toThrow()
  })

  test('Método consultarTodas deve retornar um erro caso o RepositorioArea retorne um erro', async () => {
    const { sut, repositorioAreaStub } = makeSut()
    jest.spyOn(repositorioAreaStub, 'consultar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const respostaConsultar = sut.consultarTodas()
    await expect(respostaConsultar).rejects.toThrow()
  })

  test('Deve retornar um array com todas as areas caso um parâmetro não seja fornecido', async () => {
    const { sut } = makeSut()
    const resposta = await sut.consultarTodas()
    expect(resposta).toEqual([makeAreaFalsa()])
  })

  test('Deve retornar uma area caso um parâmetro seja fornecido', async () => {
    const { sut } = makeSut()
    const area = 'AREA_QUALQUER'
    const resposta = await sut.consultar(area)
    expect(resposta).toEqual(makeAreaFalsa())
  })
})
