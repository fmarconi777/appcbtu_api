import { ConsultaAreaBD } from './consulta-area-bd'
import { RepositorioArea, ModelosAreas } from '../../protocolos/bd/area/repositorio-area'
import { ModeloArea } from '../../../dominio/modelos/area'
import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'

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

const makeValidaAreaStub = (): ValidadorBD => {
  class ValidaAreaStub implements ValidadorBD {
    async validar (parametro: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new ValidaAreaStub()
}

interface SubTipo {
  sut: ConsultaAreaBD
  validaAreaStub: ValidadorBD
  repositorioAreaStub: RepositorioArea
}

const makeSut = (): SubTipo => {
  const repositorioAreaStub = makeRepositorioArea()
  const validaAreaStub = makeValidaAreaStub()
  const sut = new ConsultaAreaBD(validaAreaStub, repositorioAreaStub)
  return {
    sut,
    validaAreaStub,
    repositorioAreaStub
  }
}

describe('ConsultaAreaBD', () => {
  test('Deve chamar o validaArea com o valor correto', async () => {
    const { sut, validaAreaStub } = makeSut()
    const validarSpy = jest.spyOn(validaAreaStub, 'validar')
    const area = 'AREA_QUALQUER'
    await sut.consultar(area)
    expect(validarSpy).toHaveBeenCalledWith('AREA_QUALQUER')
  })

  test('Deve retornar um erro caso o validaArea retorne um erro', async () => {
    const { sut, validaAreaStub } = makeSut()
    jest.spyOn(validaAreaStub, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const area = 'AREA_QUALQUER'
    const resposta = sut.consultar(area)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar null caso o validaArea retorne false', async () => {
    const { sut, validaAreaStub } = makeSut()
    jest.spyOn(validaAreaStub, 'validar').mockReturnValueOnce(Promise.resolve(false))
    const area = 'AREA_QUALQUER'
    const resposta = await sut.consultar(area)
    expect(resposta).toBeNull()
  })

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
