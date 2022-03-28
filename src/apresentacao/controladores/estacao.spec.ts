import { ControladorDeEstacao } from './estacao'
import { ConsultaEstacao } from '../../dominio/caos-de-uso/consulta-estacao'
import { ModeloEstacao } from '../../dominio/modelos/estacao'

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

interface SutTypes {
  sut: ControladorDeEstacao
  consultaEstacaoStub: ConsultaEstacao
}

const makeSut = (): SutTypes => {
  const consultaEstacaoStub = makeConsultaEstacao()
  const sut = new ControladorDeEstacao(consultaEstacaoStub)
  return {
    sut,
    consultaEstacaoStub
  }
}

describe('Controlador de estações', () => {
  test('Deve retornar codigo 200 e todas as estações se um parâmetro não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = { corpo: '' }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.codigoDeStatus).toBe(200)
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
})
