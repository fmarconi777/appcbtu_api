import { RepositorioEstacaoMariaDB } from './estacao'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'

describe('Repositorio mariaDB Estacao', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexão fechada')
  })

  const makeSut = (): RepositorioEstacaoMariaDB => {
    return new RepositorioEstacaoMariaDB()
  }

  test('Deve retornar uma estação se um parametro for passado', async () => {
    const sut = makeSut()
    const resutadoEsperado = {
      nome: 'Estação São Gabriel',
      sigla: 'usg'
    }
    const estacao = await sut.consultar('usg')
    expect(estacao).toBeTruthy()
    expect(estacao.id).toBeTruthy()
    expect(estacao).toMatchObject(resutadoEsperado)
  })
  test('Deve retornar todas as estações caso um parametro não for passado', async () => {
    const sut = makeSut()
    const resposta = await sut.consultar()
    expect(resposta).toBeTruthy()
    expect(Array.isArray(resposta)).toBeTruthy()
    expect(resposta.length).toBeGreaterThan(0)
  })
})
