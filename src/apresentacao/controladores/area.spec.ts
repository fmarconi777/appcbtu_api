import { Validador } from '../protocolos/validador'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ErroDeServidor } from '../erros/erro-de-servidor'
import { erroDeServidor } from '../auxiliares/auxiliar-http'
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

const makeValidaArea = (): Validador => {
  class ValidaAreaStub implements Validador {
    validar (parametro: string): boolean {
      return true
    }
  }
  return new ValidaAreaStub()
}

interface SutTypes {
  sut: ControladorDeArea
  consultaAreaStub: ConsultaArea
  validaAreaStub: Validador
}

const makeSut = (): SutTypes => {
  const consultaAreaStub = makeConsultaArea()
  const validaAreaStub = makeValidaArea()
  const sut = new ControladorDeArea(consultaAreaStub, validaAreaStub)
  return {
    sut,
    consultaAreaStub,
    validaAreaStub
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

  test('Deve chamar ConsultaEstacao com o valor correto', async () => {
    const { sut, consultaAreaStub } = makeSut()
    const spyConsula = jest.spyOn(consultaAreaStub, 'consultar')
    const requisicaoHttp = { parametro: 'area_qualquer', metodo: 'GET' }
    await sut.tratar(requisicaoHttp)
    expect(spyConsula).toHaveBeenCalledWith('area_qualquer')
  })

  test('Deve retornar codigo 200 e uma área se o parâmetro estiver correto', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = { parametro: 'area_valida', metodo: 'GET' }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(200)
    expect(respostaHttp.corpo).toEqual({
      id: 'id_valida',
      nome: 'nome_valido'
    })
  })

  test('Deve retornar codigo 400 se o parâmetro estiver incorreto', async () => {
    const { sut, validaAreaStub } = makeSut()
    jest.spyOn(validaAreaStub, 'validar').mockReturnValueOnce(false)
    const requisicaoHttp = { parametro: 'area_invalida', metodo: 'GET' }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(404)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('área'))
  })

  test('Deve retornar codigo 500 se o ConsultaArea retornar um erro', async () => {
    const { sut, consultaAreaStub } = makeSut()
    const erroFalso = new Error()
    erroFalso.stack = 'stack_qualquer'
    const erro = erroDeServidor(erroFalso)
    jest.spyOn(consultaAreaStub, 'consultarTodas').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(erro))
    })
    jest.spyOn(consultaAreaStub, 'consultar').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(erro))
    })
    const requisicaoHttpSemArea = { parametro: '', metodo: 'GET' }
    const requisicaoHttpComArea = { parametro: 'area_qualquer', metodo: 'GET' }
    const respostaHttpSemArea = await sut.tratar(requisicaoHttpSemArea)
    const respostaHttpComArea = await sut.tratar(requisicaoHttpComArea)
    expect(respostaHttpSemArea.status).toBe(500)
    expect(respostaHttpSemArea.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
    expect(respostaHttpComArea.status).toBe(500)
    expect(respostaHttpComArea.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
  })
})
