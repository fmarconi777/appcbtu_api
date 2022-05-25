import request from 'supertest'
import app from '../config/app'
import { bd } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'

describe('Rotas Funcionarios', () => {
  beforeAll(async () => {
    await bd.authenticate()
    console.log('conexao aberta')
  })

  afterAll(async () => {
    await bd.close()
    console.log('conexao fechada')
  })

  test('Deve retornar um funcionario em caso de sucesso', async () => {
    await request(app)
      .post('/funcionarios')
      .send({
        nome: 'Vinicius',
        email: 'email@email.com',
        senha: '123',
        administrador: true,
        areaId: '1'
      })
    expect(200)
  })
})
