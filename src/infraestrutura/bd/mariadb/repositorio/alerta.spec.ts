import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Alerta } from '../models/modelo-alerta'
import { RepositorioAlertaMariaDB } from './alerta'

describe('Repositorio mariaDB Alerta', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexão fechada')
  })

  beforeEach(async () => {
    await Alerta.destroy({ truncate: true, cascade: false })
  })

  test('Deve retornar um alerta em caso de sucesso', async () => {
    const sut = new RepositorioAlertaMariaDB()
    const alerta = await sut.inserir({
      descricao: 'descricao_valido',
      prioridade: 'pri_valido',
      dataInicio: '2022-01-01 00:00:00z',
      dataFim: '2022-02-01 00:00:00z',
      ativo: 'false',
      estacaoId: '1'
    })
    expect(alerta).toBeTruthy()
    expect(alerta.id).toBeTruthy()
    expect(alerta.descricao).toBe('descricao_valido')
    expect(alerta.dataInicio).toBe('2022-01-01T00:00:00.000Z')
    expect(alerta.dataFim).toBe('2022-02-01T00:00:00.000Z')
    expect(alerta.ativo).toBe('false')
    expect(alerta.estacaoId).toBe('1')
  })
})