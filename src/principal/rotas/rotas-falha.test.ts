import app from '@/principal/config/app'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Funcionario } from '@/infraestrutura/sequelize/models/modelo-funcionarios'
import { Falha } from '@/infraestrutura/sequelize/models/modelo-falha'
import { Equipamento } from '@/infraestrutura//sequelize/models/modelo-equipamento'
import 'dotenv/config'
import request from 'supertest'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

describe('Rotas falha', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar('test')
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

    test('Deve retornar status 404 ao adicionar uma falha com equipamentoId inválido', async () => {
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
          equipamentoId: 'NaN'
        })
        .expect(404)
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
      const equipamentos = await Equipamento.findAll({ raw: true })
      await request(app)
        .post('/falha')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          numFalha: '1234',
          equipamentoId: equipamentos[equipamentos.length - 1].id
        })
        .expect(200)
    })
  })

  describe('GET', () => {
    test('Deve retornar status 403 ao consultar uma falha sem autenticação', async () => {
      await request(app)
        .get('/falha')
        .expect(403)
    })

    test('Deve retornar status 403 ao consultar uma falha com authorization sem token de acesso', async () => {
      await request(app)
        .get('/falha')
        .set('authorization', 'Bearer ')
        .expect(403)
    })

    test('Deve retornar status 200 ao consultar uma falha com um token válido', async () => {
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
        .get('/falha')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .expect(200)
    })

    test('Deve retornar status 200 ao consultar uma falha com um parâmetro e um token válidos', async () => {
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
      const equipamentos = await Equipamento.findAll({ raw: true })
      await request(app).post('/falha').set('authorization', `Bearer ${tokenDeAcesso}`).send({ numFalha: '1234', equipamentoId: equipamentos[equipamentos.length - 1].id })
      await request(app)
        .get('/falha/1')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .expect(200)
    })
  })

  describe('PATCH', () => {
    test('Deve retornar status 403 ao alterar uma falha sem autenticação', async () => {
      await request(app)
        .patch('/falha/1')
        .send({
          numFalha: '1234',
          equipamentoId: '1'
        })
        .expect(403)
    })

    test('Deve retornar status 403 ao alterar uma falha com authorization sem token de acesso', async () => {
      await request(app)
        .patch('/falha/1')
        .set('authorization', 'Bearer ')
        .send({
          numFalha: '1234',
          equipamentoId: '1'
        })
        .expect(403)
    })

    test('Deve retornar um status 200 ao alterar uma falha com um token válido', async () => {
      const senha = await hash('123', 12)
      const resposta = await Funcionario.create({
        nome: 'alguém',
        email: 'email@email.com',
        senha,
        administrador: false,
        areaId: 16
      })
      const chave_secreta = process.env.CHAVE_SECRETA //eslint-disable-line
      const tokenDeAcesso = sign({ id: String(resposta.id) }, (chave_secreta as string), { expiresIn: 60 })
      const equipamentos = await Equipamento.findAll({ raw: true })
      await request(app).post('/falha').set('authorization', `Bearer ${tokenDeAcesso}`).send({ numFalha: '1234', equipamentoId: equipamentos[equipamentos.length - 1].id })
      await request(app)
        .patch('/falha/1')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          numFalha: '0',
          equipamentoId: equipamentos[equipamentos.length - 1].id.toString()
        })
        .expect(200)
    })
  })
})
