import app from '@/principal/config/app'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import request from 'supertest'

describe('Rotas estações', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar('test')
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
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
