import request from 'supertest'
import app from '../config/app'
import { AuxiliaresMariaDB } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Alerta } from '../../infraestrutura/bd/mariadb/models/modelo-alerta'

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
})
