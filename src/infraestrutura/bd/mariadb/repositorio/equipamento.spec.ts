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

  afterEach(async () => {
    const equipamentos = await Equipamento.findAll({ raw: true })
    await Equipamento.destroy({
      where: {
        id: equipamentos[equipamentos.length - 1].id
      },
      cascade: true
    })
  })

  const equipamentoFalso = {
    nome: 'nome_valido',
    tipo: 'tipo_valido',
    estado: '1',
    estacaoId: '1'
  }

  describe('Método inserir', () => {
    test('Deve retornar a mensagem "Equipamento cadastrado com sucesso" em caso de sucesso', async () => {
      const sut = new RepositorioEquipamentoMariaDB()
      const equipamento = await sut.inserir(equipamentoFalso)
      expect(equipamento).toEqual('Equipamento cadastrado com sucesso')
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
      const equipamentos = await Equipamento.findAll({ raw: true })
      const id = equipamentos[equipamentos.length - 1].id
      const equipamento: any = await sut.consultar(id)
      expect(equipamento).toBeTruthy()
      expect(equipamento.id).toBeTruthy()
      expect(equipamento).toMatchObject(equipamentoFalso)
    })

    test('Deve retornar null caso um parametro não cadastrado seja fornecido', async () => {
      const sut = new RepositorioEquipamentoMariaDB()
      await sut.inserir(equipamentoFalso)
      const equipamento: any = await sut.consultar(130100000000000)
      expect(equipamento).toBeNull()
    })
  })

  describe('Método alterar', () => {
    test('Deve retornar a mensagem "Cadastro alterado com sucesso" em caso de sucesso', async () => {
      const sut = new RepositorioEquipamentoMariaDB()
      await sut.inserir(equipamentoFalso)
      const equipamentos = await Equipamento.findAll({ raw: true })
      const equipamentoAlterado = {
        id: (equipamentos[equipamentos.length - 1].id).toString(),
        nome: 'nome_alterado',
        tipo: 'tipo_alterado',
        estado: '1',
        estacaoId: '1'
      }
      const resposta = await sut.alterar(equipamentoAlterado)
      expect(resposta).toEqual('Cadastro alterado com sucesso')
    })
  })
})
