import request from 'supertest'
import app from '../config/app'
import { AuxiliaresMariaDB } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { RepositorioFuncionarioMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/funcionario'
import { Funcionario } from '../../infraestrutura/bd/mariadb/models/modelo-funcionarios'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import 'dotenv/config'

describe('Rotas Funcionarios', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar()
    console.log('conexao aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexao fechada')
  })

  beforeEach(async () => {
    await Funcionario.destroy({ truncate: true, cascade: false })
  })

  describe('POST /funcionario', () => {
    test('Deve retornar status 403 ao tentar cadastrar funcionario sem autenticação', async () => {
      await request(app)
        .post('/funcionario')
        .send({
          nome: 'Vinicius',
          email: 'email@email.com',
          senha: '123',
          confirmarSenha: '123',
          administrador: 'true',
          areaId: '1'
        })
        .expect(403)
    })

    test('Deve retornar status 403 ao tentar cadastrar funcionario com authorization sem token de acesso', async () => {
      await request(app)
        .post('/funcionario')
        .set('authorization', 'Bearer ')
        .send({
          nome: 'Vinicius',
          email: 'email@email.com',
          senha: '123',
          confirmarSenha: '123',
          administrador: 'true',
          areaId: '1'
        })
        .expect(403)
    })

    test('Deve retornar status 403 ao tentar cadastrar funcionario com um token inválido', async () => {
      const senha = await hash('123', 12)
      const resposta = await Funcionario.create({
        nome: 'alguém',
        email: 'alguem@email.com',
        senha,
        administrador: false,
        areaId: 3
      })
      const chave_secreta = process.env.CHAVE_SECRETA //eslint-disable-line
      const tokenDeAcesso = sign({ id: String(resposta.id) }, (chave_secreta as string), { expiresIn: 60 })
      console.log('token de acesso', tokenDeAcesso)
      await request(app)
        .post('/funcionario')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          nome: 'Vinicius',
          email: 'vinicius@email.com',
          senha: '123',
          confirmarSenha: '123',
          administrador: 'true',
          areaId: '1'
        })
        .expect(403)
    })

    test('Deve retornar status 200 ao tentar cadastrar funcionario com um token válido', async () => {
      const senha = await hash('123', 12)
      const resposta = await Funcionario.create({
        nome: 'alguém',
        email: 'alguem@email.com',
        senha,
        administrador: true,
        areaId: 3
      })
      const chave_secreta = process.env.CHAVE_SECRETA //eslint-disable-line
      const tokenDeAcesso = sign({ id: String(resposta.id) }, (chave_secreta as string), { expiresIn: 60 })
      await request(app)
        .post('/funcionario')
        .set('authorization', `Bearer ${tokenDeAcesso}`)
        .send({
          nome: 'Vinicius',
          email: 'vinicius@email.com',
          senha: '123',
          confirmarSenha: '123',
          administrador: 'true',
          areaId: '1'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Deve retornar satus 200 em caso de sucesso', async () => {
      const senha = await hash('123', 12)
      const repositorioFuncionarioMariaDB = new RepositorioFuncionarioMariaDB()
      await repositorioFuncionarioMariaDB.adicionar({
        nome: 'Vinicius',
        email: 'email@email.com',
        senha,
        administrador: 'true',
        areaId: '1'
      })
      await request(app)
        .post('/login')
        .send({
          email: 'email@email.com',
          senha: '123'
        })
        .expect(200)
    })

    test('Deve retornar satus 401 caso o usuário seja inválido', async () => {
      await request(app)
        .post('/login')
        .send({
          email: 'email@email.com',
          senha: '123'
        })
        .expect(401)
    })
  })
})
