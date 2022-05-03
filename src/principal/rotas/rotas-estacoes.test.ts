import request from 'supertest'
import app from '../config/app'
import { bd } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'

describe('Rotas estações', () => {
  beforeAll(async () => {
    await bd.authenticate()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await bd.close()
    console.log('conexão fechada')
  })

  test('Deve retornar todas as estações em caso de sucesso', async () => {
    await request(app)
      .get('/estacao')
      .expect(200)
  })
  test('Deve retornar uma estação se um parâmetro for passado em caso de sucesso', async () => {
    await request(app)
      .get('/estacao/ulg')
      .expect(200)
  })
})
