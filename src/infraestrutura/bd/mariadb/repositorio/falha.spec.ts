import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Equipamento } from '../models/modelo-equipamento'
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

  test('Deve retornar a mensagem "Falha cadastrada com sucesso" em caso de sucesso ao inserir uma falha', async () => {
    const sut = new RepositorioFalhaMariaDB()
    const equipamentos = await Equipamento.findAll({ raw: true })
    const dadosFalsos = {
      numFalha: '12345',
      dataCriacao: '2011-04-11T10:20:30Z',
      equipamentoId: (equipamentos[equipamentos.length - 1].id).toString()
    }
    const resposta = await sut.inserir(dadosFalsos)
    expect(resposta).toEqual('Falha cadastrada com sucesso')
  })
})
