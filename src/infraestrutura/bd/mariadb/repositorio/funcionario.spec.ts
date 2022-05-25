import { bd } from '../auxiliares/auxiliar-mariadb'
import { Funcionario } from '../models/modelo-funcionarios'
import { RepositorioFuncionarioMariaDB } from './funcionario'

describe('Repositorio mariaDB Funcionario', () => {
  beforeAll(async () => {
    await bd.authenticate()
    console.log('conexão aberta')
  })
  afterAll(async () => {
    await bd.close()
    console.log('conexão fechada')
  })

  beforeEach(async () => {
    await Funcionario.destroy({ truncate: true, cascade: false })
  })
  test('Deve retornar um funcionario em caso de sucesso', async () => {
    const sut = new RepositorioFuncionarioMariaDB()
    const funcionario = await sut.adicionar({
      nome: 'nome_valido',
      email: 'email_valido',
      senha: 'hash_senha',
      administrador: 'false',
      areaId: '1'
    })
    expect(funcionario).toBeTruthy()
    expect(funcionario.id).toBeTruthy()
    expect(funcionario.nome).toBe('nome_valido')
    expect(funcionario.email).toBe('email_valido')
    expect(funcionario.senha).toBe('hash_senha')
    expect(funcionario.administrador).toBe(false)
    expect(funcionario.areaId).toBe('1')
  })
})
