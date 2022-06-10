import request from 'supertest'
import app from '../config/app'
import { AuxiliaresMariaDB } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Equipamento } from '../../infraestrutura/bd/mariadb/models/modelo-equipamento'
import { Funcionario } from '../../infraestrutura/bd/mariadb/models/modelo-funcionarios'
import 'dotenv/config'

describe('Rotas equipamentos', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexão fechada')
  })

  beforeEach(async () => {
    await Equipamento.destroy({ truncate: true, cascade: false })
    await Funcionario.destroy({ truncate: true, cascade: false })
  })

  test('Deve retornar um status 403 ao adicionar um equipamento sem autenticação', async () => {
    await request(app)
      .post('/equipamento')
      .send({
        nome: 'Escada rolante',
        tipo: 'escada',
        numFalha: '35647',
        estado: '1',
        estacaoId: '1'
      })
      .expect(403)
  })

  test('Deve retornar um status 403 ao adicionar um equipamento com authorization sem token de acesso', async () => {
    await request(app)
      .post('/equipamento')
      .set('authorization', 'Bearer ')
      .send({
        nome: 'Escada rolante',
        tipo: 'escada',
        numFalha: '35647',
        estado: '1',
        estacaoId: '1'
      })
      .expect(403)
  })
})
