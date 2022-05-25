import { bd } from '../auxiliares/auxiliar-mariadb'
import { Erros } from '../models/modelo-erros'
import { RepositorioLogDeErroMariaDB } from './log'

describe('Repositório log de erro', () => {
  beforeAll(async () => {
    await bd.authenticate()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await bd.close()
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