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

    describe('Método GET', () => {
      test('Deve retornar status 200 ao consultar a rota alerta sem parametro', async () => {
        await request(app)
          .get('/alerta')
          .expect(200)
      })
    })
  })
})
