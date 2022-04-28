import request from 'supertest'
import app from '../config/app'

describe('Rotas estações', () => {
  test('Deve retornar todas as estações em caso de sucesso', async () => {
    await request(app)
      .get('/estacao')
      .expect(200)
  })
  test('Deve retornar uma estação se um parâmetro for passado em caso de sucesso', async () => {
    await request(app)
      .get('/estacao/sigla')
      .expect(200)
  })
})
