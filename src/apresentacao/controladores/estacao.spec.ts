import { ControladorDeEstacao } from './estacao'
import { ConsultaEstacao } from '../../dominio/caos-de-uso/consulta-estacao'
import { ModeloEstacao } from '../../dominio/modelos/estacao'
import { ValidaParametro } from '../protocolos/valida-parametro'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ErroDeServidor } from '../erros/erro-de-servidor'

const makeConsultaEstacao = (): ConsultaEstacao => {
  class ConsultaEstacaoStub implements ConsultaEstacao {
    async consultaTodas (): Promise<ModeloEstacao[]> {
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

    async consulta (parametro: string): Promise<ModeloEstacao> {
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

const makeValidaParametro = (): ValidaParametro => {
  class ValidaParametroStub implements ValidaParametro {
    validar (parametro: string): boolean {
      return true
    }
  }
  return new ValidaParametroStub()
}

interface SutTypes {
  sut: ControladorDeEstacao
  consultaEstacaoStub: ConsultaEstacao
  validaParametroStub: ValidaParametro
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
    const requisicaoHttp = { corpo: '' }
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
    const spyConsula = jest.spyOn(consultaEstacaoStub, 'consulta')
    const requisicaoHttp = { corpo: 'sigla_qualquer' }
    await sut.tratar(requisicaoHttp)
    expect(spyConsula).toHaveBeenCalledWith('sigla_qualquer')
  })

  test('Deve retornar codigo 200 e uma estação se o parâmetro estiver correto', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = { corpo: 'sigla_valida' }
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

  test('Deve retornar codigo 400 se o parâmetro estiver incorreto', async () => {
    const { sut, validaParametroStub } = makeSut()
    jest.spyOn(validaParametroStub, 'validar').mockReturnValueOnce(false)
    const requisicaoHttp = { corpo: 'sigla_invalida' }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('sigla'))
  })

  test('Deve retornar codigo 500 se o ConsultaEstacao retornar um erro', async () => {
    const { sut, consultaEstacaoStub } = makeSut()
    jest.spyOn(consultaEstacaoStub, 'consultaTodas').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    jest.spyOn(consultaEstacaoStub, 'consulta').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const requisicaoHttpSemSigla = { corpo: '' }
    const requisicaoHttpComSigla = { corpo: 'sigla_qualquer' }
    const respostaHttpSemSigla = await sut.tratar(requisicaoHttpSemSigla)
    const respostaHttpComSigla = await sut.tratar(requisicaoHttpComSigla)
    expect(respostaHttpSemSigla.status).toBe(500)
    expect(respostaHttpSemSigla.corpo).toEqual(new ErroDeServidor())
    expect(respostaHttpComSigla.status).toBe(500)
    expect(respostaHttpComSigla.corpo).toEqual(new ErroDeServidor())
  })
})
