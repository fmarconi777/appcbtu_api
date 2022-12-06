import app from '@/principal/config/app'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Telefone } from '@/infraestrutura/sequelize/models/modelo-telefone'
import { Funcionario } from '@/infraestrutura/sequelize/models/modelo-funcionarios'
import 'dotenv/config'
import request from 'supertest'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

describe('Rotas Telefone', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar('test')
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

    test('Deve retornar status 200 ao adicionar um telefone com com um token válido', async () => {
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
        .post('/telefone')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          numero: '3132505555',
          estacaoId: '1'
        })
        .expect(200)
    })
  })
})
