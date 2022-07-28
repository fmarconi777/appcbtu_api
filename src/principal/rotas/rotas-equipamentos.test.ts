import request from 'supertest'
import app from '../config/app'
import { AuxiliaresMariaDB } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Funcionario } from '../../infraestrutura/bd/mariadb/models/modelo-funcionarios'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import 'dotenv/config'
import { Equipamento } from '../../infraestrutura/bd/mariadb/models/modelo-equipamento'

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
    await Funcionario.destroy({ truncate: true, cascade: false })
  })

  describe('PATCH', () => {
    test('Deve retornar um status 403 ao alterar o estado de um equipamento sem autenticação', async () => {
      await request(app)
        .patch('/equipamento/1')
        .send({
          estado: '0'
        })
        .expect(403)
    })

    test('Deve retornar um status 403 ao alterar o estado de um equipamento com authorization sem token de acesso', async () => {
      await request(app)
        .patch('/equipamento/1')
        .set('authorization', 'Bearer ')
        .send({
          estado: '0'
        })
        .expect(403)
    })

    test('Deve retornar um status 400 ao alterar um equipamento sem estado com um token válido', async () => {
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
        .patch(`/equipamento/${equipamentos[equipamentos.length - 1].id}`)
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send()
        .expect(400)
    })

    test('Deve retornar status 404 caso um parametro inválido seja fornecido', async () => {
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
        .patch('/equipamento/NaN')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          estado: '0'
        })
        .expect(404)
    })

    test('Deve retornar status 404 caso um parametro não cadastrado seja fornecido', async () => {
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
        .patch('/equipamento/156000000000')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          estado: '0'
        })
        .expect(404)
    })
  })

  describe('POST', () => {
    test('Deve retornar um status 403 ao adicionar um equipamento sem autenticação', async () => {
      await request(app)
        .post('/equipamento')
        .send({
          nome: 'Escada rolante',
          tipo: 'escada',
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
        estado: '1',
        estacaoId: '1'
      })
      const equipamentos = await Equipamento.findAll({ raw: true })
      await request(app)
        .get(`/equipamento/${equipamentos[equipamentos.length - 1].id}`)
        .expect(200)
    })

    test('Deve retornar status 404 caso um parametro inválido seja fornecido', async () => {
      await request(app)
        .get('/equipamento/NaN')
        .expect(404)
    })

    test('Deve retornar status 404 caso um parametro não cadastrado seja fornecido', async () => {
      await request(app)
        .get('/equipamento/130100000000000')
        .expect(404)
    })
  })

  describe('PUT', () => {
    test('Deve retornar um status 403 ao alterar um equipamento sem autenticação', async () => {
      await request(app)
        .put('/equipamento/1')
        .send({
          nome: 'nome alterado',
          tipo: 'tipo alterado',
          estado: '1',
          estacaoId: '1'
        })
        .expect(403)
    })

    test('Deve retornar um status 403 ao alterar um equipamento com authorization sem token de acesso', async () => {
      await request(app)
        .put('/equipamento/1')
        .set('authorization', 'Bearer ')
        .send({
          nome: 'nome alterado',
          tipo: 'tipo alterado',
          estado: '1',
          estacaoId: '1'
        })
        .expect(403)
    })

    test('Deve retornar um status 400 ao alterar um equipamento sem nome com um token válido', async () => {
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
        .put(`/equipamento/${equipamentos[equipamentos.length - 1].id}`)
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          tipo: 'tipo alterado',
          estado: '1',
          estacaoId: '1'
        })
        .expect(400)
    })

    test('Deve retornar um status 400 ao alterar um equipamento sem tipo com um token válido', async () => {
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
        .put(`/equipamento/${equipamentos[equipamentos.length - 1].id}`)
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          nome: 'nome alterado',
          estado: '1',
          estacaoId: '1'
        })
        .expect(400)
    })

    test('Deve retornar um status 400 ao alterar um equipamento sem estado com um token válido', async () => {
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
        .put(`/equipamento/${equipamentos[equipamentos.length - 1].id}`)
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          nome: 'nome alterado',
          tipo: 'tipo alterado',
          estacaoId: '1'
        })
        .expect(400)
    })

    test('Deve retornar um status 400 ao alterar um equipamento sem estacaoId com um token válido', async () => {
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
        .put(`/equipamento/${equipamentos[equipamentos.length - 1].id}`)
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          nome: 'nome alterado',
          tipo: 'tipo alterado',
          estado: '1'
        })
        .expect(400)
    })

    test('Deve retornar status 404 caso um parametro inválido seja fornecido', async () => {
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
        .put('/equipamento/NaN')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          nome: 'nome alterado',
          tipo: 'tipo alterado',
          estado: '1',
          estacaoId: '1'
        })
        .expect(404)
    })

    test('Deve retornar status 404 caso um parametro não cadastrado seja fornecido', async () => {
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
        .put('/equipamento/156000000000')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          nome: 'nome alterado',
          tipo: 'tipo alterado',
          estado: '1',
          estacaoId: '1'
        })
        .expect(404)
    })

    test('Deve retornar status 404 caso um estacaoId não cadastrado seja fornecido', async () => {
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
        .put(`/equipamento/${equipamentos[equipamentos.length - 1].id}`)
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          nome: 'nome alterado',
          tipo: 'tipo alterado',
          estado: '1',
          estacaoId: '159800000000000000'
        })
        .expect(404)
    })

    test('Deve retornar status 200 em caso de sucesso ao alterar um cadastro de equipamento', async () => {
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
        .put(`/equipamento/${equipamentos[equipamentos.length - 1].id}`)
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          nome: 'nome alterado',
          tipo: 'tipo alterado',
          estado: '1',
          estacaoId: '1'
        })
        .expect(200)
    })
  })
})
