import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Equipamento } from '../models/modelo-equipamento'
import { Falha } from '../models/modelo-falha'
import { RepositorioFalhaMariaDB } from './falha'

describe('RepositorioFalhaMariaDB', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexão fechada')
  })

  beforeEach(async () => {
    await Falha.destroy({ truncate: true, cascade: false })
  })

  describe('Método inserir', () => {
    test('Deve retornar a mensagem "Falha cadastrada com sucesso" em caso de sucesso ao inserir uma falha', async () => {
      const sut = new RepositorioFalhaMariaDB()
      const equipamentos = await Equipamento.findAll({ raw: true })
      const dadosFalsos = {
        numFalha: '12345',
        dataCriacao: '2011-04-11T10:20:30Z',
        equipamentoId: (equipamentos[equipamentos.length - 1].id).toString()
      }
      const resposta = await sut.inserir(dadosFalsos)
      expect(resposta).toEqual('Falha cadastrada com sucesso')
    })
  })

  describe('Método consultar', () => {
    test('Deve retornar um array com todas as falhas em caso de sucesso se um parâmetro não seja fornecido', async () => {
      const sut = new RepositorioFalhaMariaDB()
      const equipamentos = await Equipamento.findAll({ raw: true })
      const dadosFalsos = {
        numFalha: '12345',
        dataCriacao: '2011-04-11T10:20:30Z',
        equipamentoId: (equipamentos[equipamentos.length - 1].id).toString()
      }
      await sut.inserir(dadosFalsos)
      const resposta: any = await sut.consultar()
      expect(resposta).toBeTruthy()
      expect(Array.isArray(resposta)).toBeTruthy()
      expect(resposta.length).toBeGreaterThan(0)
    })

    test('Deve retornar uma falha em caso de sucesso se um parâmetro for fornecido', async () => {
      const sut = new RepositorioFalhaMariaDB()
      const equipamentos = await Equipamento.findAll({ raw: true })
      const dadosFalsos = {
        numFalha: '12345',
        dataCriacao: '2011-04-11T10:20:30.000Z',
        equipamentoId: (equipamentos[equipamentos.length - 1].id).toString()
      }
      await sut.inserir(dadosFalsos)
      const resposta: any = await sut.consultar(1)
      expect(resposta.id).toBeTruthy()
      expect(resposta).toMatchObject(dadosFalsos)
    })

    test('Deve retornar null em caso um parâmetro não cadastrado for fornecido', async () => {
      const sut = new RepositorioFalhaMariaDB()
      const resposta = await sut.consultar(1999)
      expect(resposta).toBeNull()
    })
  })
})
