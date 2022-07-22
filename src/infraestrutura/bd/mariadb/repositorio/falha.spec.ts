import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Falha } from '../models/modelo-falha'
import { RepositorioFalhaMariaDB } from './falha'

describe('RepositorioFalhaMariaDB', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexão fechada')
  })

  beforeEach(async () => {
    await Falha.destroy({ truncate: true, cascade: false })
  })

  const dadosFalsos = {
    numFalha: '12345',
    dataCriacao: '2011-04-11T10:20:30Z',
    equipamentoId: '1'
  }

  test('Deve retornar a mensagem "Falha cadastrada com sucesso" em caso de sucesso ao inserir uma falha', async () => {
    const sut = new RepositorioFalhaMariaDB()
    const resposta = await sut.inserir(dadosFalsos)
    expect(resposta).toEqual('Falha cadastrada com sucesso')
  })
})
