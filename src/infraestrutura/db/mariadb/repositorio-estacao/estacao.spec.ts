import { bd } from '../auxiliares/auxiliar-mariadb'
import { RepositorioEstacaoMariaDB } from './estacao'

describe('Repositorio mariaDB Estacao', () => {
  beforeAll(async () => {
    await bd.authenticate()
    console.log('conexão aberta')
  })

  afterAll(async () => {
    await bd.close()
    console.log('conexão fechada')
  })

  test('Deve retornar uma estação em caso de sucesso', async () => {
    const sut = new RepositorioEstacaoMariaDB()
    const estacao = await sut.consulta('usg')
    expect(estacao).toBeTruthy()
    expect(estacao.id).toBeTruthy()
    expect(estacao.nome).toBe('Estação São Gabriel')
    expect(estacao.sigla).toBe('usg')
    expect(estacao.codigo).toBe('asdf32')
    expect(estacao.endereco).toBe('rua das flores')
    expect(estacao.latitude).toBe('41.5656')
    expect(estacao.longitude).toBe('85.9696')
  })
})
