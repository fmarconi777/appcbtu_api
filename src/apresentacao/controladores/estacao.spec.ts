import { ControladorDeEstacao } from './estacao'
import { ConsultaEstacao } from '../../dominio/casos-de-uso/estacao/consulta-estacao'
import { ModeloEstacao } from '../../dominio/modelos/estacao'
import { Validador } from '../protocolos/validador'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ErroDeServidor } from '../erros/erro-de-servidor'
import { erroDeServidor } from '../auxiliares/auxiliar-http'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'

const makeConsultaEstacao = (): ConsultaEstacao => {
  class ConsultaEstacaoStub implements ConsultaEstacao {
    async consultarTodas (): Promise<ModeloEstacao[]> {
      const listaFalsa = [{
        id: 'id_qualquer',
        nome: 'nome_qualquer',
        sigla: 'sigla_qualquer',
        codigo: 'codigo_qualquer',
        endereco: 'endereco_qualquer',
        latitude: 'latitude_qualquer',
        longitude: 'longitude_qualquer'
      }]
      return await new Promise(resolve => resolve(listaFalsa))
    }

    async consultar (parametro: string): Promise<ModeloEstacao> {
      const estacaoFalsa = {
        id: 'id_valida',
        nome: 'nome_valido',
        sigla: parametro,
        codigo: 'codigo_valido',
        endereco: 'endereco_valido',
        latitude: 'latitude_valida',
        longitude: 'longitude_valida'
      }
      return await new Promise(resolve => resolve(estacaoFalsa))
    }
  }
  return new ConsultaEstacaoStub()
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
  sut: ControladorDeEstacao
  consultaEstacaoStub: ConsultaEstacao
  validaParametroStub: Validador
}

const makeSut = (): SutTypes => {
  const consultaEstacaoStub = makeConsultaEstacao()
  const validaParametroStub = makeValidaParametro()
  const sut = new ControladorDeEstacao(consultaEstacaoStub, validaParametroStub)
  return {
    sut,
    consultaEstacaoStub,
    validaParametroStub
  }
}

describe('Controlador de estações', () => {
  test('Deve retornar codigo 200 e todas as estações se um parâmetro não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = { corpo: '', metodo: 'GET' }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(200)
    expect(respostaHttp.corpo).toEqual([{
      id: 'id_qualquer',
      nome: 'nome_qualquer',
      sigla: 'sigla_qualquer',
      codigo: 'codigo_qualquer',
      endereco: 'endereco_qualquer',
      latitude: 'latitude_qualquer',
      longitude: 'longitude_qualquer'
    }])
  })

  test('Deve chamar ConsultaEstacao com o valor correto', async () => {
    const { sut, consultaEstacaoStub } = makeSut()
    const spyConsula = jest.spyOn(consultaEstacaoStub, 'consultar')
    const requisicaoHttp = { parametro: 'sigla_qualquer', metodo: 'GET' }
    await sut.tratar(requisicaoHttp)
    expect(spyConsula).toHaveBeenCalledWith('sigla_qualquer')
  })

  test('Deve retornar codigo 200 e uma estação se o parâmetro estiver correto', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = { parametro: 'sigla_valida', metodo: 'GET' }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(200)
    expect(respostaHttp.corpo).toEqual({
      id: 'id_valida',
      nome: 'nome_valido',
      sigla: 'sigla_valida',
      codigo: 'codigo_valido',
      endereco: 'endereco_valido',
      latitude: 'latitude_valida',
      longitude: 'longitude_valida'
    })
  })

  test('Deve chamar ValidaParametro com o valor correto', async () => {
    const { sut, validaParametroStub } = makeSut()
    const spyConsula = jest.spyOn(validaParametroStub, 'validar')
    const requisicaoHttp = { parametro: 'sigla_qualquer', metodo: 'GET' }
    await sut.tratar(requisicaoHttp)
    expect(spyConsula).toHaveBeenCalledWith('sigla_qualquer')
  })

  test('Deve retornar codigo 400 se o parâmetro estiver incorreto', async () => {
    const { sut, validaParametroStub } = makeSut()
    jest.spyOn(validaParametroStub, 'validar').mockReturnValueOnce(false)
    const requisicaoHttp = { parametro: 'sigla_invalida', metodo: 'GET' }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(404)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('sigla'))
  })

  test('Deve retornar codigo 500 se o ConsultaEstacao retornar um erro', async () => {
    const { sut, consultaEstacaoStub } = makeSut()
    const erroFalso = new Error()
    erroFalso.stack = 'stack_qualquer'
    const erro = erroDeServidor(erroFalso)
    jest.spyOn(consultaEstacaoStub, 'consultarTodas').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(erro))
    })
    jest.spyOn(consultaEstacaoStub, 'consultar').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(erro))
    })
    const requisicaoHttpSemSigla = { parametro: '', metodo: 'GET' }
    const requisicaoHttpComSigla = { parametro: 'sigla_qualquer', metodo: 'GET' }
    const respostaHttpSemSigla = await sut.tratar(requisicaoHttpSemSigla)
    const respostaHttpComSigla = await sut.tratar(requisicaoHttpComSigla)
    expect(respostaHttpSemSigla.status).toBe(500)
    expect(respostaHttpSemSigla.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
    expect(respostaHttpComSigla.status).toBe(500)
    expect(respostaHttpComSigla.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
  })

  test('Deve retornar codigo 400 se um método não suportado for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = { parametro: 'sigla_qualquer', metodo: 'metodo_invalido' }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroMetodoInvalido())
  })
})
