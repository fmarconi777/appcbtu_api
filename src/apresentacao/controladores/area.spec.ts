import { Validador } from '../protocolos/validador'
import { ControladorDeArea } from './area'
import { ConsultaArea } from '../../dominio/casos-de-uso/area/consulta-area'
import { ModeloArea } from '../../dominio/modelos/area'

const makeConsultaArea = (): ConsultaArea => {
  class ConsultaAreaStub implements ConsultaArea {
    async consultarTodas (): Promise<ModeloArea[]> {
      const listaFalsa = [{
        id: 'id_qualquer',
        nome: 'nome_qualquer'
      }]
      return await new Promise(resolve => resolve(listaFalsa))
    }

    async consultar (parametro: string): Promise<ModeloArea> {
      const areaFalsa = {
        id: 'id_valida',
        nome: 'nome_valido'
      }
      return await new Promise(resolve => resolve(areaFalsa))
    }
  }
  return new ConsultaAreaStub()
}

const makeValidaParametro = (): Validador => {
  class ValidaParametroStub implements Validador {
    validar (parametro: string): boolean {
      return true
    }
  }
  return new ValidaParametroStub()
}

interface SutTypes {
  sut: ControladorDeArea
  consultaAreaStub: ConsultaArea
  validaParametroStub: Validador
}

const makeSut = (): SutTypes => {
  const consultaAreaStub = makeConsultaArea()
  const validaParametroStub = makeValidaParametro()
  const sut = new ControladorDeArea(consultaAreaStub, validaParametroStub)
  return {
    sut,
    consultaAreaStub,
    validaParametroStub
  }
}

describe('Controlador de estações', () => {
  test('Deve retornar codigo 200 e todas as áreas se um parâmetro não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = { corpo: '', metodo: 'GET' }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(200)
    expect(respostaHttp.corpo).toEqual([{
      id: 'id_qualquer',
      nome: 'nome_qualquer'
    }])
  })

  test('Deve chamar ConsultaArea com o valor correto', async () => {
    const { sut, consultaAreaStub } = makeSut()
    const spyConsula = jest.spyOn(consultaAreaStub, 'consultar')
    const requisicaoHttp = { parametro: 'area_qualquer', metodo: 'GET' }
    await sut.tratar(requisicaoHttp)
    expect(spyConsula).toHaveBeenCalledWith('area_qualquer')
  })
})
