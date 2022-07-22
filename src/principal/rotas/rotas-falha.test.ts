import request from 'supertest'
import app from '../config/app'
import { AuxiliaresMariaDB } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Funcionario } from '../../infraestrutura/bd/mariadb/models/modelo-funcionarios'

describe('Rotas falha', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexão fechada')
  })

  beforeEach(async () => {
    await Funcionario.destroy({ truncate: true, cascade: false })
  })

  describe('POST', () => {
    test('Deve retornar status 403 ao adicionar uma falha sem autenticação', async () => {
      await request(app)
        .post('/falha')
        .send({
          numFalha: '1234',
          equipamentoId: '1'
        })
        .expect(403)
    })
  })
})
