import { ValidadorDeEstacao } from './validador-de-estacao'
import { ConsultaEstacao } from '@/dominio/casos-de-uso/estacao/consulta-estacao'
import { ModeloEstacao } from '@/dominio/modelos/estacao'
import { ValidadorBD } from '@/dados/protocolos/utilidades/validadorBD'

const makeConsultaEstacao = (): ConsultaEstacao => {
  class ConsultaEstacaoStub implements ConsultaEstacao {
    async consultarTodas (): Promise<ModeloEstacao[]> {
      const listaFalsa = [{
        id: '1',
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

interface SubTipos {
  sut: ValidadorBD
  consultaEstacaoStub: ConsultaEstacao
}

const makeSut = (): SubTipos => {
  const consultaEstacaoStub = makeConsultaEstacao()
  const sut = new ValidadorDeEstacao(consultaEstacaoStub)
  return {
    sut,
    consultaEstacaoStub
  }
}

describe('Validador de parametro', () => {
  test('Deve retornar false se o validador retornar falso', async () => {
    const { sut } = makeSut()
    const eValido = await sut.validar('id_invalida')
    expect(eValido).toBe(false)
  })

  test('Deve retornar true se o validador retornar true', async () => {
    const { sut } = makeSut()
    const eValido = await sut.validar(1)
    expect(eValido).toBe(true)
  })
})
