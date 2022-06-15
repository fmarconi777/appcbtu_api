import { AuxiliaresMariaDB } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import request from 'supertest'
import app from '../config/app'

describe('Rotas Area', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexão fechada')
  })

  describe('GET', () => {
    test('Deve retornar status 403 ao consultar uma area sem autenticação', async () => {
      await request(app)
        .get('/area')
        .send()
        .expect(403)
    })

    test('Deve retornar status 403 ao consultar uma area com authorization sem token de acesso', async () => {
      await request(app)
        .get('/area')
        .set('authorization', 'Bearer ')
        .send()
        .expect(403)
    })
  })
})
