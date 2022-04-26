import { bd } from '../auxiliares/auxiliar-mariadb'
import { RepositorioEstacaoMariaDB } from './estacao'

describe('Repositorio mariaDB Estacao', () => {
  beforeAll(async () => {
    await bd.authenticate()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await bd.close()
    console.log('conexão fechada')
  })

  const makeSut = (): RepositorioEstacaoMariaDB => {
    return new RepositorioEstacaoMariaDB()
  }

  test('Deve retornar uma estação se um parametro for passado', async () => {
    const sut = makeSut()
    const resutadoEsperado = {
      nome: 'Estação São Gabriel',
      sigla: 'usg',
      codigo: 'asdf32',
      endereco: 'rua das flores',
      latitude: '41.5656',
      longitude: '85.9696'
    }
    const estacao = await sut.consulta('usg')
    expect(estacao).toBeTruthy()
    expect(estacao.id).toBeTruthy()
    expect(estacao).toMatchObject(resutadoEsperado)
  })
  test('Deve retornar todas as estações caso um parametro não for passado', async () => {
    const sut = makeSut()
    const resutadoEsperado = [
      {
        nome: 'Estação São Gabriel',
        sigla: 'usg',
        codigo: 'asdf32',
        endereco: 'rua das flores',
        latitude: '41.5656',
        longitude: '85.9696'
      },
      {
        nome: 'Estação Minas Shopping',
        sigla: 'ums',
        codigo: 'asdf32',
        endereco: 'rua dos cravos',
        latitude: '39.4141',
        longitude: '86.3478'
      }
    ]
    const estacao = await sut.consulta()
    expect(estacao).toBeTruthy()
    expect(estacao[0].id).toBeTruthy()
    expect(estacao[1].id).toBeTruthy()
    expect(estacao[0]).toMatchObject(resutadoEsperado[0])
    expect(estacao[1]).toMatchObject(resutadoEsperado[1])
  })
})
