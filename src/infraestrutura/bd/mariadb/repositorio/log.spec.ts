import { RepositorioLogDeErroMariaDB } from './log'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Erros } from '@/infraestrutura/sequelize/models/modelo-erros'

describe('Repositório log de erro', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar('test')
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexão fechada')
  })

  beforeEach(async () => {
    await Erros.destroy({ truncate: true, cascade: false })
  })
  test('Deve criar um log de erro caso seja chamado', async () => {
    const sut = new RepositorioLogDeErroMariaDB()
    await sut.logErro('stack_qualquer')
    const contagemDeErro = await Erros.count()
    expect(contagemDeErro).toBe(1)
  })
})
