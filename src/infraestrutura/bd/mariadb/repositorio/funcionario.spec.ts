import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Funcionario } from '../models/modelo-funcionarios'
import { RepositorioFuncionarioMariaDB } from './funcionario'

describe('Repositorio mariaDB Funcionario', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar()
    console.log('conexão aberta')
  })
  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexão fechada')
  })

  beforeEach(async () => {
    await Funcionario.destroy({ truncate: true, cascade: false })
  })
  test('Deve retornar um funcionario em caso de sucesso ao adicionar', async () => {
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
    expect(funcionario.administrador).toBe('false')
    expect(funcionario.areaId).toBe('1')
  })

  test('Deve retornar um funcionario em caso de sucesso ao consultar por email', async () => {
    const sut = new RepositorioFuncionarioMariaDB()
    const contaFalsa = {
      nome: 'nome_valido',
      email: 'email_valido',
      senha: 'hash_senha',
      administrador: 'false',
      areaId: '1'
    }
    const resutadoEsperado = {
      nome: 'nome_valido',
      email: 'email_valido',
      senha: 'hash_senha',
      administrador: 'false',
      areaId: '1'
    }
    await sut.adicionar(contaFalsa)
    const funcionario = await sut.consultaPorEmail('email_valido')
    expect(funcionario).toBeTruthy()
    expect(funcionario).toMatchObject(resutadoEsperado)
  })

  test('Deve retornar null caso a consulta por email falhar', async () => {
    const sut = new RepositorioFuncionarioMariaDB()
    const funcionario = await sut.consultaPorEmail('email_valido')
    expect(funcionario).toBeFalsy()
  })
})
