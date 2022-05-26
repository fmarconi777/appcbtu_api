import { RepositorioEstacao, ModelosEstacoes } from '../../protocolos/bd/repositorio-estacao'
import { ConsultaEstacaoBD } from './consulta-estacao-bd'

const makeRepositorioEstacao = (): RepositorioEstacao => {
  class RepositorioEstacaoStub implements RepositorioEstacao {
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
  return new RepositorioEstacaoStub()
}

interface SutTypes {
  sut: ConsultaEstacaoBD
  RepositorioEstacaoStub: RepositorioEstacao
}

const makeSut = (): SutTypes => {
  const RepositorioEstacaoStub = makeRepositorioEstacao()
  const sut = new ConsultaEstacaoBD(RepositorioEstacaoStub)
  return {
    sut,
    RepositorioEstacaoStub
  }
}

describe('Caso de uso ConsultaEstacaoBD', () => {
  test('Deve chamar RepositorioEstacao com o valor correto', async () => {
    const { sut, RepositorioEstacaoStub } = makeSut()
    const consultaSpy = jest.spyOn(RepositorioEstacaoStub, 'consulta')
    const sigla = 'sigla_qualquer'
    await sut.consulta(sigla)
    expect(consultaSpy).toHaveBeenCalledWith('sigla_qualquer')
  })

  test('Metodo consulta deve retornar um erro se o RepositorioEstacao retornar um erro', async () => {
    const { sut, RepositorioEstacaoStub } = makeSut()
    jest.spyOn(RepositorioEstacaoStub, 'consulta').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const sigla = 'sigla_qualquer'
    const consulta = sut.consulta(sigla)
    await expect(consulta).rejects.toThrow()
  })

  test('Metodo consultaTodas deve retornar um erro se o RepositorioEstacao retornar um erro', async () => {
    const { sut, RepositorioEstacaoStub } = makeSut()
    jest.spyOn(RepositorioEstacaoStub, 'consulta').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
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
