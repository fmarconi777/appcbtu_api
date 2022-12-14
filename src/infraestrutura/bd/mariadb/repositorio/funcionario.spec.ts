import { RepositorioFuncionarioMariaDB } from './funcionario'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { Funcionario } from '@/infraestrutura/sequelize/models/modelo-funcionarios'

describe('Repositorio mariaDB Funcionario', () => {
  beforeAll(async () => {
    await AuxiliaresMariaDB.conectar('test')
    console.log('conexão aberta')
  })
  afterAll(async () => {
    await AuxiliaresMariaDB.desconectar()
    console.log('conexão fechada')
  })

  beforeEach(async () => {
    await Funcionario.destroy({ truncate: true, cascade: false })
  })

  describe('Metodo adicionar', () => {
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
  })

  describe('Metodo consultarPorEmail', () => {
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
      const funcionario = await sut.consultarPorEmail('email_valido')
      expect(funcionario).toBeTruthy()
      expect(funcionario?.id).toBeTruthy()
      expect(funcionario).toMatchObject(resutadoEsperado)
    })

    test('Deve retornar null caso a consulta por email falhar', async () => {
      const sut = new RepositorioFuncionarioMariaDB()
      const funcionario = await sut.consultarPorEmail('email_valido')
      expect(funcionario).toBeFalsy()
    })
  })

  describe('Metodo consultarPorId', () => {
    test('Deve retornar um funcionario em caso de sucesso ao consultar por id', async () => {
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
      const funcionario = await sut.consultarPorId('1')
      expect(funcionario).toBeTruthy()
      expect(funcionario?.id).toBeTruthy()
      expect(funcionario).toMatchObject(resutadoEsperado)
    })

    test('Deve retornar um funcionario em caso de sucesso ao consultar por id e nivel admin', async () => {
      const sut = new RepositorioFuncionarioMariaDB()
      const contaFalsa = {
        nome: 'nome_valido',
        email: 'email_valido',
        senha: 'hash_senha',
        administrador: 'true',
        areaId: '1'
      }
      const resutadoEsperado = {
        nome: 'nome_valido',
        email: 'email_valido',
        senha: 'hash_senha',
        administrador: 'true',
        areaId: '1'
      }
      await sut.adicionar(contaFalsa)
      const funcionario = await sut.consultarPorId('1', 'admin')
      expect(funcionario).toBeTruthy()
      expect(funcionario?.id).toBeTruthy()
      expect(funcionario).toMatchObject(resutadoEsperado)
    })

    test('Deve retornar um funcionario em caso de sucesso ao consultar por id e nivel areaId', async () => {
      const sut = new RepositorioFuncionarioMariaDB()
      const contaFalsa1 = {
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
      await sut.adicionar(contaFalsa1)
      const funcionario = await sut.consultarPorId('1', '1')
      expect(funcionario).toBeTruthy()
      expect(funcionario?.id).toBeTruthy()
      expect(funcionario).toMatchObject(resutadoEsperado)
    })

    test('Deve retornar null, caso funcionario não seja administrador, ao consultar por id e nivel admin', async () => {
      const sut = new RepositorioFuncionarioMariaDB()
      const contaFalsa = {
        nome: 'nome_valido',
        email: 'email_valido',
        senha: 'hash_senha',
        administrador: 'false',
        areaId: '1'
      }
      await sut.adicionar(contaFalsa)
      const funcionario = await sut.consultarPorId('1', 'admin')
      expect(funcionario).toBeNull()
    })

    test('Deve retornar null, caso funcionario não seja da area permitida, ao consultar por id e nivel areaId', async () => {
      const sut = new RepositorioFuncionarioMariaDB()
      const contaFalsa = {
        nome: 'nome_valido',
        email: 'email_valido',
        senha: 'hash_senha',
        administrador: 'false',
        areaId: '3'
      }
      await sut.adicionar(contaFalsa)
      const funcionario = await sut.consultarPorId('1', '1')
      expect(funcionario).toBeNull()
    })

    test('Deve retornar null caso a consulta por id falhar', async () => {
      const sut = new RepositorioFuncionarioMariaDB()
      const funcionario = await sut.consultarPorId('id_qualquer')
      expect(funcionario).toBeNull()
    })

    test('Deve retornar null caso a consulta por id e areaId falhar', async () => {
      const sut = new RepositorioFuncionarioMariaDB()
      const funcionario = await sut.consultarPorId('id_qualquer', '1')
      expect(funcionario).toBeNull()
    })

    test('Deve retornar null caso a consulta por id e admin falhar', async () => {
      const sut = new RepositorioFuncionarioMariaDB()
      const funcionario = await sut.consultarPorId('id_qualquer', 'admin')
      expect(funcionario).toBeNull()
    })
  })

  describe('Método consultaPorNome', () => {
    test('Deve retornar um funcionario em caso de sucesso ao consultar por nome', async () => {
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
      const funcionario = await sut.consultarPorNome('nome_valido')
      expect(funcionario).toBeTruthy()
      expect(funcionario?.id).toBeTruthy()
      expect(funcionario).toMatchObject(resutadoEsperado)
    })

    test('Deve retornar null caso a consulta por nome falhar', async () => {
      const sut = new RepositorioFuncionarioMariaDB()
      const funcionario = await sut.consultarPorId('nome_qualquer')
      expect(funcionario).toBeNull()
    })
  })
})
