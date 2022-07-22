import request from 'supertest'
import app from '../config/app'
import { AuxiliaresMariaDB } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Funcionario } from '../../infraestrutura/bd/mariadb/models/modelo-funcionarios'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import 'dotenv/config'
import { Falha } from '../../infraestrutura/bd/mariadb/models/modelo-falha'

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
    await Falha.destroy({ truncate: true, cascade: false })
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

    test('Deve retornar status 403 ao adicionar uma falha com authorization sem token de acesso', async () => {
      await request(app)
        .post('/falha')
        .set('authorization', 'Bearer ')
        .send({
          numFalha: '1234',
          equipamentoId: '1'
        })
        .expect(403)
    })

    test('Deve retornar um status 200 ao adicionar uma falha com um token válido', async () => {
      const senha = await hash('123', 12)
      const resposta = await Funcionario.create({
        nome: 'alguém',
        email: 'email@email.com',
        senha,
        administrador: true,
        areaId: 3
      })
      const chave_secreta = process.env.CHAVE_SECRETA //eslint-disable-line
      const tokenDeAcesso = sign({ id: String(resposta.id) }, (chave_secreta as string), { expiresIn: 60 })
      await request(app)
        .post('/falha')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          numFalha: '1234',
          equipamentoId: '1'
        })
        .expect(200)
    })
  })
})
