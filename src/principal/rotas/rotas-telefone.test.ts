import request from 'supertest'
import app from '../config/app'
import { AuxiliaresMariaDB } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Telefone } from '../../infraestrutura/bd/mariadb/models/modelo-telefone'

describe('Rotas Telefone', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar()
    console.log('conexao aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexao fechada')
  })

  beforeEach(async () => {
    await Telefone.destroy({ truncate: true, cascade: false })
  })

  describe('POST', () => {
    test('Deve retornar status 403 ao adicionar um telefone sem autenticação', async () => {
      await request(app)
        .post('/telefone')
        .send({
          numero: '3132505555',
          estacaoId: '1'
        })
        .expect(403)
    })

    test('Deve retornar status 403 ao adicionar um telefone com authorization sem token de acesso', async () => {
      await request(app)
        .post('/telefone')
        .set('authorization', 'Bearer ')
        .send({
          numero: '3132505555',
          estacaoId: '1'
        })
        .expect(403)
    })
  })
})
