import request from 'supertest'
import app from '../config/app'
import { AuxiliaresMariaDB } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Alerta } from '../../infraestrutura/bd/mariadb/models/modelo-alerta'
import { Funcionario } from '../../infraestrutura/bd/mariadb/models/modelo-funcionarios'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import 'dotenv/config'

describe('Rotas Alerta', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexão fechada')
  })

  beforeEach(async () => {
    await Alerta.destroy({ truncate: true, cascade: false })
  })

  describe('Método POST', () => {
    test('Deve retornar status 403 ao adicionar um alerta sem autenticação', async () => {
      await request(app)
        .post('/alerta')
        .send({
          descricao: 'Estação Parada!',
          prioridade: 'Altissima',
          dataInicio: '2022-02-05',
          dataFim: '2022-02-05',
          ativo: 'true',
          estacaoId: '1'
        })
        .expect(403)
    })

    test('Deve retornar status 403 ao adicionar um alerta com authorization sem token de acesso', async () => {
      await request(app)
        .post('/alerta')
        .set('authorization', 'Bearer ')
        .send({
          descricao: 'Estação Parada!',
          prioridade: 'Altissima',
          dataInicio: '2022-02-05',
          dataFim: '2022-02-05',
          ativo: 'true',
          estacaoId: '1'
        })
        .expect(403)
    })

    test('Deve retornar status 200 ao adicionar um alerta com um token válido', async () => {
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
        .post('/alerta')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          descricao: 'Estação Parada!',
          prioridade: 'Altissima',
          dataInicio: '2022-02-05',
          dataFim: '2022-02-05',
          ativo: 'true',
          estacaoId: '1'
        })
        .expect(200)
    })
  })

  describe('Método GET', () => {
    test('Deve retornar status 200 ao consultar a rota alerta sem parametro', async () => {
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
      await request(app).post('/alerta').set('authorization', `Bearer ${tokenDeAcesso}`).send({
        descricao: 'Estação Parada!',
        prioridade: 'Altissima',
        dataInicio: '02-05-2022',
        dataFim: '12-31-2022',
        ativo: 'true',
        estacaoId: '1'
      })
      await request(app)
        .get('/alerta')
        .expect(200)
    })

    test('Deve retornar status 200 ao consultar a rota alerta com sigla válida', async () => {
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
      await request(app).post('/alerta').set('authorization', `Bearer ${tokenDeAcesso}`).send({
        descricao: 'Estação Parada!',
        prioridade: 'Altissima',
        dataInicio: '02-05-2022',
        dataFim: '12-31-2022',
        ativo: 'true',
        estacaoId: '1'
      })
      await request(app)
        .get('/alerta/usg')
        .expect(200)
    })

    test('Deve retornar status 404 ao consultar a rota alerta com sigla inválida', async () => {
      await request(app)
        .get('/alerta/sigla-invalida')
        .expect(404)
    })

    test('Deve retornar status 200 ao consultar a rota alerta com sigla e id válidos', async () => {
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
      await request(app).post('/alerta').set('authorization', `Bearer ${tokenDeAcesso}`).send({
        descricao: 'Estação Parada!',
        prioridade: 'Altissima',
        dataInicio: '02-05-2022',
        dataFim: '12-31-2022',
        ativo: 'true',
        estacaoId: '1'
      })
      const alertas = await Alerta.findAll({ raw: true })
      await request(app)
        .get(`/alerta/usg/${+alertas[alertas.length - 1].id}`)
        .expect(200)
    })

    test('Deve retornar status 404 ao consultar a rota alerta com id inválido', async () => {
      await request(app)
        .get('/alerta/usg/NaN')
        .expect(404)
    })

    test('Deve retornar status 404 ao consultar a rota alerta com id não cadastrado ou inativo', async () => {
      await request(app)
        .get('/alerta/usg/13999999999')
        .expect(404)
    })
  })

  describe('Método PATCH', () => {
    test('Deve retornar status 403 ao adicionar um alerta sem autenticação', async () => {
      await request(app)
        .patch('/alerta/1')
        .send({
          descricao: 'Descrição alterada',
          prioridade: 'Alterada',
          dataInicio: '2022-02-05',
          dataFim: '2022-02-05',
          estacaoId: '1'
        })
        .expect(403)
    })

    test('Deve retornar status 403 ao adicionar um alerta com authorization sem token de acesso', async () => {
      await request(app)
        .patch('/alerta/1')
        .set('authorization', 'Bearer ')
        .send({
          descricao: 'Descrição alterada',
          prioridade: 'Alterada',
          dataInicio: '2022-02-05',
          dataFim: '2022-02-05',
          estacaoId: '1'
        })
        .expect(403)
    })

    test('Deve retornar status 400 ao alterar um alerta faltando um campo requerido', async () => {
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
      await request(app).post('/alerta').set('authorization', `Bearer ${tokenDeAcesso}`).send({
        descricao: 'Estação Parada!',
        prioridade: 'Altissima',
        dataInicio: '2022-02-05',
        dataFim: '2025-02-05',
        ativo: 'true',
        estacaoId: '1'
      })
      const alertas = await Alerta.findAll({ raw: true })
      await request(app)
        .patch(`/alerta/${alertas[0].id}`)
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          prioridade: 'Alterada',
          dataInicio: '2022-02-05',
          dataFim: '2025-02-05',
          estacaoId: '1'
        })
        .expect(400)
    })

    test('Deve retornar status 404 ao alterar um alerta inválido ou desativado', async () => {
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
        .patch('/alerta/10')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          descricao: 'Descrição alterada',
          prioridade: 'Alterada',
          dataInicio: '2022-02-05',
          dataFim: '2025-02-05',
          estacaoId: '1'
        })
        .expect(404)
    })

    test('Deve retornar status 404 ao alterar um alerta com estacaoId inválido ou desativado', async () => {
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
      await request(app).post('/alerta').set('authorization', `Bearer ${tokenDeAcesso}`).send({
        descricao: 'Estação Parada!',
        prioridade: 'Altissima',
        dataInicio: '2022-02-05',
        dataFim: '2022-02-05',
        ativo: 'true',
        estacaoId: '1'
      })
      const alertas = await Alerta.findAll({ raw: true })
      await request(app)
        .patch(`/alerta/${alertas[0].id}`)
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          descricao: 'Descrição alterada',
          prioridade: 'Alterada',
          dataInicio: '2022-02-05',
          dataFim: '2025-02-05',
          estacaoId: '1'
        })
        .expect(404)
    })

    test('Deve retornar status 200 ao alterar um alerta com um token válido', async () => {
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
      await request(app).post('/alerta').set('authorization', `Bearer ${tokenDeAcesso}`).send({
        descricao: 'Estação Parada!',
        prioridade: 'Altissima',
        dataInicio: '2022-02-05',
        dataFim: '2025-02-05',
        ativo: 'true',
        estacaoId: '1'
      })
      const alertas = await Alerta.findAll({ raw: true })
      await request(app)
        .patch(`/alerta/${alertas[0].id}`)
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          descricao: 'Descrição alterada',
          prioridade: 'Alterada',
          dataInicio: '2022-02-05',
          dataFim: '2025-02-05',
          estacaoId: '1'
        })
        .expect(200)
    })
  })

  describe('Método DELETE', () => {
    test('Deve retornar status 403 ao deletar um alerta sem autenticação', async () => {
      await request(app)
        .delete('/alerta/1')
        .expect(403)
    })

    test('Deve retornar status 403 ao deletar um alerta com authorization sem token de acesso', async () => {
      await request(app)
        .delete('/alerta/1')
        .set('authorization', 'Bearer ')
        .expect(403)
    })

    test('Deve retornar status 404 ao deletar um alerta inválido com um token válido', async () => {
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
        .delete('/alerta/NaN')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .expect(404)
    })
  })
})
