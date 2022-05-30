import request from 'supertest'
import app from '../config/app'
import { bd } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { RepositorioFuncionarioMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/funcionario'
import { hash } from 'bcrypt'
import { Funcionario } from '../../infraestrutura/bd/mariadb/models/modelo-funcionarios'

describe('Rotas Funcionarios', () => {
  beforeAll(async () => {
    await bd.authenticate()
    console.log('conexao aberta')
  })

  afterAll(async () => {
    await bd.close()
    console.log('conexao fechada')
  })

  beforeEach(async () => {
    await Funcionario.destroy({ truncate: true, cascade: false })
  })

  describe('POST /funcionario', () => {
    test('Deve retornar satus 200 em caso de sucesso', async () => {
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
  })
})
