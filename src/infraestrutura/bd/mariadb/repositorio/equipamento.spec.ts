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

  test('Deve retornar um equipamento em caso de sucesso', async () => {
    const sut = new RepositorioEquipamentoMariaDB()
    const equipamento = await sut.inserir({
      nome: 'nome_valido',
      tipo: 'tipo_valido',
      numFalha: '1',
      estado: '1',
      estacaoId: '1'
    })
    expect(equipamento).toBeTruthy()
    expect(equipamento.id).toBeTruthy()
    expect(equipamento.nome).toBe('nome_valido')
    expect(equipamento.tipo).toBe('tipo_valido')
    expect(equipamento.numFalha).toBe('1')
    expect(equipamento.estado).toBe('1')
    expect(equipamento.estacaoId).toBe('1')
  })
})
