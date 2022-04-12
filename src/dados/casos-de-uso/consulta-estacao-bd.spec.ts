
import { ConsultaRepositorioEstacao, ModelosEstacoes } from '../protocolos/consulta-repositorio-estacao'
import { ConsultaEstacaoBD } from './consulta-estacao-bd'

const makeConsultaRepositorioEstacao = (): ConsultaRepositorioEstacao => {
  class ConsultaRepositorioEstacaoStub implements ConsultaRepositorioEstacao {
    async consulta (sigla?: string): Promise<ModelosEstacoes> {
      if (!sigla) { // eslint-disable-line
        return await new Promise(resolve => resolve([{
          id: 'id_valida',
          nome: 'nome_valido',
          sigla: 'sigla_valida',
          codigo: 'codigo_valido',
          endereco: 'endereco_valido',
          latitude: 'latitude_valida',
          longitude: 'longitude_valida'
        }]))
      }
      return await new Promise(resolve => resolve({
        id: 'id_valida',
        nome: 'nome_valido',
        sigla: 'sigla_valida',
        codigo: 'codigo_valido',
        endereco: 'endereco_valido',
        latitude: 'latitude_valida',
        longitude: 'longitude_valida'
      }))
    }
  }
  return new ConsultaRepositorioEstacaoStub()
}

interface SutTypes {
  sut: ConsultaEstacaoBD
  consultaRepositorioEstacaoStub: ConsultaRepositorioEstacao
}

const makeSut = (): SutTypes => {
  const consultaRepositorioEstacaoStub = makeConsultaRepositorioEstacao()
  const sut = new ConsultaEstacaoBD(consultaRepositorioEstacaoStub)
  return {
    sut,
    consultaRepositorioEstacaoStub
  }
}

describe('Caso de uso ConsultaEstacaoBD', () => {
  test('Deve chamar ConsultaRepositorioEstacao com o valor correto', async () => {
    const { sut, consultaRepositorioEstacaoStub } = makeSut()
    const consultaSpy = jest.spyOn(consultaRepositorioEstacaoStub, 'consulta')
    const sigla = 'sigla_valida'
    await sut.consulta(sigla)
    expect(consultaSpy).toHaveBeenCalledWith('sigla_valida')
  })
})
