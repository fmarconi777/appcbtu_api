import { ValidadorBD } from '../../dados/protocolos/utilidades/validadorBD'
import { ValidadorDeArea } from './validador-de-area'
import { ConsultaArea } from '../../dominio/casos-de-uso/area/consulta-area'
import { ModeloArea } from '../../dominio/modelos/area'

const makeConsultaArea = (): ConsultaArea => {
  class ConsultaAreaStub implements ConsultaArea {
    async consultarTodas (): Promise<ModeloArea[]> {
      const listaFalsa = [{
        id: 'id_qualquer',
        nome: 'NOME_QUALQUER'
      }]
      return await new Promise(resolve => resolve(listaFalsa))
    }

    async consultar (parametro: string): Promise<ModeloArea> {
      const areaFalsa = {
        id: 'id_valida',
        nome: parametro
      }
      return await new Promise(resolve => resolve(areaFalsa))
    }
  }
  return new ConsultaAreaStub()
}

interface SubTipos {
  sut: ValidadorBD
  consultaAreaStub: ConsultaArea
}

const makeSut = (): SubTipos => {
  const consultaAreaStub = makeConsultaArea()
  const sut = new ValidadorDeArea(consultaAreaStub)
  return {
    sut,
    consultaAreaStub
  }
}

describe('Validador de parametro', () => {
  test('Deve retornar false se o validador retornar falso', async () => {
    const { sut } = makeSut()
    const eValido = await sut.validar('AREA_INVALIDA')
    expect(eValido).toBe(false)
  })

  test('Deve retornar true se o validador retornar true', async () => {
    const { sut } = makeSut()
    const eValido = await sut.validar('NOME_QUALQUER')
    expect(eValido).toBe(true)
  })
})
