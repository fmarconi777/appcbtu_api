import { AuxiliaresMariaDB } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import request from 'supertest'
import app from '../config/app'
import { hash } from 'bcrypt'
import { Funcionario } from '../../infraestrutura/bd/mariadb/models/modelo-funcionarios'
import { sign } from 'jsonwebtoken'

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

    test('Deve retornar status 200 ao consultar uma area com token de acesso válido', async () => {
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
        .get('/area')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send()
        .expect(200)
    })
  })
})
