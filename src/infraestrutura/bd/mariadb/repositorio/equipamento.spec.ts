import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { RepositorioEquipamentoMariaDB } from './equipamento'
import { Equipamento } from '../models/modelo-equipamento'

describe('Repositorio mariaDB Equipamento', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexão fechada')
  })

  beforeEach(async () => {
    await Equipamento.destroy({ truncate: true, cascade: false })
  })

  const equipamentoFalso = {
    nome: 'nome_valido',
    tipo: 'tipo_valido',
    numFalha: '1',
    estado: '1',
    estacaoId: '1'
  }

  describe('Método inserir', () => {
    test('Deve retornar um equipamento em caso de sucesso', async () => {
      const sut = new RepositorioEquipamentoMariaDB()
      const equipamento = await sut.inserir(equipamentoFalso)
      expect(equipamento).toBeTruthy()
      expect(equipamento.id).toBeTruthy()
      expect(equipamento.nome).toBe('nome_valido')
      expect(equipamento.tipo).toBe('tipo_valido')
      expect(equipamento.numFalha).toBe('1')
      expect(equipamento.estado).toBe('1')
      expect(equipamento.estacaoId).toBe('1')
    })
  })

  describe('Método consultar', () => {
    test('Deve retornar um array de equipamentos em caso de sucesso se um parametro não for fornecido', async () => {
      const sut = new RepositorioEquipamentoMariaDB()
      await sut.inserir(equipamentoFalso)
      const equipamentos: any = await sut.consultar()
      expect(equipamentos).toBeTruthy()
      expect(Array.isArray(equipamentos)).toBeTruthy()
      expect(equipamentos.length).toBeGreaterThan(0)
    })

    test('Deve retornar um equipamento em caso de sucesso se um parametro for fornecido', async () => {
      const sut = new RepositorioEquipamentoMariaDB()
      await sut.inserir(equipamentoFalso)
      const equipamento: any = await sut.consultar(1)
      expect(equipamento).toBeTruthy()
      expect(equipamento.id).toBeTruthy()
      expect(equipamento).toMatchObject(equipamentoFalso)
    })

    test('Deve retornar a mensagem "Equipamento não cadastrado" caso um parametro não cadastrado seja fornecido', async () => {
      const sut = new RepositorioEquipamentoMariaDB()
      await sut.inserir(equipamentoFalso)
      const equipamento: any = await sut.consultar(1301)
      expect(equipamento).toEqual('Equipamento não cadastrado')
    })
  })
})
