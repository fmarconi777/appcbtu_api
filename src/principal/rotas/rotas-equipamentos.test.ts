import request from 'supertest'
import app from '../config/app'
import { bd } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Equipamento } from '../../infraestrutura/bd/mariadb/models/modelo-equipamento'

describe('Rotas equipamentos', () => {
  beforeAll(async () => {
    await bd.authenticate()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await bd.close()
    console.log('conexão fechada')
  })

  beforeEach(async () => {
    await Equipamento.destroy({ truncate: true, cascade: false })
  })

  test('Deve retornar um equipamento em caso de sucesso', async () => {
    await request(app)
      .post('/equipamento')
      .send({
        nome: 'Escada rolante',
        tipo: 'escada',
        numFalha: '35647',
        estado: '1',
        estacaoId: '1'
      })
      .expect(200)
  })
})
