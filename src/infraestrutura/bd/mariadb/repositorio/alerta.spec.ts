import { bd } from '../auxiliares/auxiliar-mariadb'
import { Alerta } from '../models/modelo-alerta'
import { RepositorioAlertaMariaDB } from './alerta'

describe('Repositorio mariaDB Alerta', () => {
  beforeAll(async () => {
    await bd.authenticate()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await bd.close()
    console.log('conexão fechada')
  })

  beforeEach(async () => {
    await Alerta.destroy({ truncate: true, cascade: false })
  })

  test('Deve retornar um alerta em caso de sucesso', async () => {
    const sut = new RepositorioAlertaMariaDB()
    const alerta = await sut.adicionando({
      descricao: 'descricao_valido',
      prioridade: 'prioridade_valido',
      dataInicio: 'datainicio_valido',
      dataFim: 'datafim_valido',
      ativo: 'ativo_valido',
      estacaoId: '1'
    })
    expect(alerta).toBeTruthy()
    expect(alerta.id).toBeTruthy()
    expect(alerta.descricao).toBe('descricao_valido')
    expect(alerta.dataInicio).toBe('datainicio_valido')
    expect(alerta.dataFim).toBe('datafim_valido')
    expect(alerta.ativo).toBe('ativo_valido')
    expect(alerta.estacaoId).toBe('1')
  })
})
