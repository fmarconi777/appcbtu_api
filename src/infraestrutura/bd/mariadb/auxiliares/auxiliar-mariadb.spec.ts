import { AuxiliaresMariaDB as sut } from './auxiliar-mariadb'

describe('Auxiliares MariaDB', () => {
  beforeAll(async () => {
    await sut.conectar()
  })

  afterAll(async () => {
    await sut.desconectar()
  })

  test('Deve reconectar ao mariaDB se estiver desconectado', async () => {
    await sut.desconectar()
    let cliente = sut.cliente
    expect(cliente).toBeNull()
    await sut.verificaConexao()
    cliente = sut.cliente
    expect(cliente).toBeTruthy()
  })
})
