
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
        sigla: sigla,
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
    const sigla = 'sigla_qualquer'
    await sut.consulta(sigla)
    expect(consultaSpy).toHaveBeenCalledWith('sigla_qualquer')
  })

  test('Metodo consulta deve retornar um erro se o ConsultaRepositorioEstacao retornar um erro', async () => {
    const { sut, consultaRepositorioEstacaoStub } = makeSut()
    jest.spyOn(consultaRepositorioEstacaoStub, 'consulta').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const sigla = 'sigla_qualquer'
    const consulta = sut.consulta(sigla)
    await expect(consulta).rejects.toThrow()
  })

  test('Metodo consultaTodas deve retornar um erro se o ConsultaRepositorioEstacao retornar um erro', async () => {
    const { sut, consultaRepositorioEstacaoStub } = makeSut()
    jest.spyOn(consultaRepositorioEstacaoStub, 'consulta').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const consulta = sut.consultaTodas()
    await expect(consulta).rejects.toThrow()
  })

  test('Deve retornar array com todas as estações se um parâmetro não for fornecido', async () => {
    const { sut } = makeSut()
    const consulta = await sut.consultaTodas()
    expect(consulta).toEqual([{
      id: 'id_valida',
      nome: 'nome_valido',
      sigla: 'sigla_valida',
      codigo: 'codigo_valido',
      endereco: 'endereco_valido',
      latitude: 'latitude_valida',
      longitude: 'longitude_valida'
    }])
  })

  test('Deve retornar uma estação se um parâmetro for fornecido', async () => {
    const { sut } = makeSut()
    const sigla = 'sigla_valida'
    const consulta = await sut.consulta(sigla)
    expect(consulta).toEqual({
      id: 'id_valida',
      nome: 'nome_valido',
      sigla: 'sigla_valida',
      codigo: 'codigo_valido',
      endereco: 'endereco_valido',
      latitude: 'latitude_valida',
      longitude: 'longitude_valida'
    })
  })
})
