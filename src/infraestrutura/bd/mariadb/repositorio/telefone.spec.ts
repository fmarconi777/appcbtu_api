import { RepositorioTelefoneMariaDB } from './telefone'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Telefone } from '@/infraestrutura/sequelize/models/modelo-telefone'

describe('RepositorioTelefoneMariaDB', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar('test')
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexão fechada')
  })

  beforeEach(async () => {
    await Telefone.destroy({ truncate: true, cascade: false })
  })

  describe('Método inserir', () => {
    test('Deve retornar a mensagem "Telefone cadastrado com sucesso" em caso de sucesso ao inserir um telefone', async () => {
      const sut = new RepositorioTelefoneMariaDB()
      const resposta = await sut.inserir({ numero: 3132505555, estacaoId: 1 })
      expect(resposta).toBe('Telefone cadastrado com sucesso')
    })
  })
})
