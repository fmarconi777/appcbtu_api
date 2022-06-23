import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { RepositorioAreaMariaDB } from './area'

describe('RepositorioAreaMariaDB', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexão fechada')
  })

  const makeSut = (): RepositorioAreaMariaDB => {
    return new RepositorioAreaMariaDB()
  }

  const resultadoEsperado = {
    nome: 'COINF'
  }

  describe('Método consultar', () => {
    test('Deve retornar uma área se um parametro for fornecido', async () => {
      const sut = makeSut()
      const resposta = await sut.consultar('COINF')
      expect(resposta).toBeTruthy()
      expect(resposta.id).toBeTruthy()
      expect(resposta).toMatchObject(resultadoEsperado)
    })

    test('Deve retornar todas as áreas se um parametro não for fornecido', async () => {
      const sut = makeSut()
      const resposta = await sut.consultar()
      expect(resposta).toBeTruthy()
      expect(Array.isArray(resposta)).toBeTruthy()
      expect(resposta.length).toBeGreaterThan(0)
    })
  })

  describe('Método consultarPorNome', () => {
    test('Deve retornar uma área em caso de sucesso ao consultar por nome', async () => {
      const sut = makeSut()
      const resposta = await sut.consultarPorNome('COINF')
      expect(resposta).toBeTruthy()
      expect(resposta?.id).toBeTruthy()
      expect(resposta).toMatchObject(resultadoEsperado)
    })
  })
})
