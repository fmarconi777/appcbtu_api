import { RepositorioAreaMariaDB } from './area'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Area } from '@/infraestrutura/bd/mariadb/models/modelo-area'

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

    test('Deve retornar null se um parametro não cadastrado for fornecido', async () => {
      const sut = makeSut()
      const resposta = await sut.consultar('AREA')
      expect(resposta).toBeNull()
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

    test('Deve retornar null caso ao consultar por nome falhar', async () => {
      const sut = makeSut()
      const resposta = await sut.consultarPorNome('AREA')
      expect(resposta).toBeNull()
    })
  })

  describe('Método consultarPorId', () => {
    test('Deve retornar uma área em caso de sucesso ao consultar por id', async () => {
      const sut = makeSut()
      const resposta = await sut.consultarPorId(32)
      expect(resposta).toBeTruthy()
      expect(resposta?.id).toBeTruthy()
      expect(resposta).toMatchObject(resultadoEsperado)
    })

    test('Deve retornar null caso ao consultar por id falhar', async () => {
      const sut = makeSut()
      const resposta = await sut.consultarPorId(56)
      expect(resposta).toBeNull()
    })
  })

  describe('Método inserir', () => {
    test('Deve retornar uma área em caso de sucesso', async () => {
      const sut = makeSut()
      const resposta = await sut.inserir(99, 'AREA_VALIDA')
      expect(resposta).toBeTruthy()
      expect(resposta.id).toBeTruthy()
      expect(resposta.nome).toEqual('AREA_VALIDA')
      await Area.destroy({ where: { nome: 'AREA_VALIDA' } })
    })
  })

  describe('Método deletar', () => {
    test('Deve retornar a mensagem "Erro ao deletar área" em caso de falha', async () => {
      const sut = makeSut()
      const resposta = await sut.deletar('AREA_INVALIDA')
      expect(resposta).toBe('Erro ao deletar área')
    })

    test('Deve retornar a mensagem "Área deletada com sucesso" em caso de sucesso', async () => {
      const sut = makeSut()
      await sut.inserir(99, 'AREA_VALIDA')
      const resposta = await sut.deletar('AREA_VALIDA')
      expect(resposta).toBe('Área deletada com sucesso')
    })
  })

  describe('Método alterar', () => {
    test('Deve retornar a mensagem "Área alterada com sucesso" em caso de sucesso', async () => {
      const sut = makeSut()
      await sut.inserir(99, 'AREA_VALIDA')
      const resposta = await sut.alterar('AREA_ALTERADA', 'AREA_VALIDA')
      expect(resposta).toBe('Área alterada com sucesso')
      await Area.destroy({ where: { nome: 'AREA_ALTERADA' } })
    })
  })
})
