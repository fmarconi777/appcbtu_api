import request from 'supertest'
import app from '../config/app'
import { AuxiliaresMariaDB } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Equipamento } from '../../infraestrutura/bd/mariadb/models/modelo-equipamento'
import { Funcionario } from '../../infraestrutura/bd/mariadb/models/modelo-funcionarios'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
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

  describe('POST', () => {
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

    test('Deve retornar um status 200 ao adicionar um equipamento com um token válido', async () => {
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
        .post('/equipamento')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          nome: 'Escada rolante',
          tipo: 'escada',
          numFalha: '35647',
          estado: '1',
          estacaoId: '1'
        })
        .expect(200)
    })
  })

  describe('GET', () => {
    test('Deve retornar status 200 caso um parametro não seja fornecido', async () => {
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
      await request(app).post('/equipamento').set('authorization', `Bearer ${tokenDeAcesso}`).send({
        nome: 'Escada rolante',
        tipo: 'escada',
        numFalha: '35647',
        estado: '1',
        estacaoId: '1'
      })
      await request(app)
        .get('/equipamento')
        .expect(200)
    })

    test('Deve retornar status 200 caso um parametro seja fornecido', async () => {
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
      await request(app).post('/equipamento').set('authorization', `Bearer ${tokenDeAcesso}`).send({
        nome: 'Escada rolante',
        tipo: 'escada',
        numFalha: '35647',
        estado: '1',
        estacaoId: '1'
      })
      await request(app)
        .get('/equipamento/1')
        .expect(200)
    })
  })
})
