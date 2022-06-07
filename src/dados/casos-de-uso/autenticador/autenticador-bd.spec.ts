import { Autenticador } from '../../../dominio/casos-de-uso/autenticador/autenticador'
import { ModeloFuncionario } from '../../../dominio/modelos/funcionario'
import { RepositorioConsultaFuncionarioPorEmail } from '../../protocolos/bd/repositorio-consulta-funcionario-por-email'
import { AutenticadorBD } from './autenticador-bd'
import { ComparadorHash } from '../../protocolos/criptografia/comparador-hash'
import { Encriptador } from '../../protocolos/criptografia/encriptador'

const makeRepositorioConsultaFuncionarioPorEmail = (): RepositorioConsultaFuncionarioPorEmail => {
  class RepositorioConsultaFuncionarioPorEmailStub implements RepositorioConsultaFuncionarioPorEmail {
    async consultarPorEmail (email: string): Promise<ModeloFuncionario> {
      const funcionarioFalso: ModeloFuncionario = {
        id: 'id_qualquer',
        nome: 'nome_qualquer',
        email: 'email_qualquer',
        senha: 'senha_hash',
        administrador: 'false',
        areaId: 'areaId_qualquer'
      }
      return await new Promise(resolve => resolve(funcionarioFalso))
    }
  }
  return new RepositorioConsultaFuncionarioPorEmailStub()
}

const makeComparadorHash = (): ComparadorHash => {
  class ComparadorHashStub implements ComparadorHash {
    async comparar (senha: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new ComparadorHashStub()
}

const makeEncriptador = (): Encriptador => {
  class EncriptadorStub implements Encriptador {
    async encriptar (valor: string): Promise<string > {
      return await new Promise(resolve => resolve('token_qualquer'))
    }
  }
  return new EncriptadorStub()
}

interface SubTipos {
  sut: Autenticador
  repositorioConsultaFuncionarioPorEmailStub: RepositorioConsultaFuncionarioPorEmail
  comparadorHashStub: ComparadorHash
  encriptadorStub: Encriptador
}

const makeSut = (): SubTipos => {
  const repositorioConsultaFuncionarioPorEmailStub = makeRepositorioConsultaFuncionarioPorEmail()
  const comparadorHashStub = makeComparadorHash()
  const encriptadorStub = makeEncriptador()
  const sut = new AutenticadorBD(repositorioConsultaFuncionarioPorEmailStub, comparadorHashStub, encriptadorStub)
  return {
    sut,
    repositorioConsultaFuncionarioPorEmailStub,
    comparadorHashStub,
    encriptadorStub
  }
}

describe('Autenticação no banco de dados', () => {
  test('Deve chamar RepositorioConsultaFuncionarioPorEmail com o email correto', async () => {
    const { sut, repositorioConsultaFuncionarioPorEmailStub } = makeSut()
    const consultarPorEmailSpy = jest.spyOn(repositorioConsultaFuncionarioPorEmailStub, 'consultarPorEmail')
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    await sut.autenticar(autenticacao)
    expect(consultarPorEmailSpy).toHaveBeenCalledWith('email_qualquer@mail.com')
  })

  test('Deve retornar um erro caso o RepositorioConsultaFuncionarioPorEmail retorne um erro', async () => {
    const { sut, repositorioConsultaFuncionarioPorEmailStub } = makeSut()
    jest.spyOn(repositorioConsultaFuncionarioPorEmailStub, 'consultarPorEmail').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    const promise = sut.autenticar(autenticacao)
    await expect(promise).rejects.toThrow()
  })

  test('Deve retornar null caso o RepositorioConsultaFuncionarioPorEmail retorne null', async () => {
    const { sut, repositorioConsultaFuncionarioPorEmailStub } = makeSut()
    jest.spyOn(repositorioConsultaFuncionarioPorEmailStub, 'consultarPorEmail').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    const tokenDeAcesso = await sut.autenticar(autenticacao)
    expect(tokenDeAcesso).toBeNull()
  })

  test('Deve chamar o ComparadorHash com os parametros corretos', async () => {
    const { sut, comparadorHashStub } = makeSut()
    const compararSpy = jest.spyOn(comparadorHashStub, 'comparar')
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    await sut.autenticar(autenticacao)
    expect(compararSpy).toHaveBeenCalledWith('senha_qualquer', 'senha_hash')
  })

  test('Deve retornar um erro caso o ComparadorHash retorne um erro', async () => {
    const { sut, comparadorHashStub } = makeSut()
    jest.spyOn(comparadorHashStub, 'comparar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    const promise = sut.autenticar(autenticacao)
    await expect(promise).rejects.toThrow()
  })

  test('Deve retornar null caso o ComparadorHash retorne false', async () => {
    const { sut, comparadorHashStub } = makeSut()
    jest.spyOn(comparadorHashStub, 'comparar').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    const tokenDeAcesso = await sut.autenticar(autenticacao)
    expect(tokenDeAcesso).toBeNull()
  })

  test('Deve chamar o Encriptador com o id correto', async () => {
    const { sut, encriptadorStub } = makeSut()
    const encriptarSpy = jest.spyOn(encriptadorStub, 'encriptar')
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    await sut.autenticar(autenticacao)
    expect(encriptarSpy).toHaveBeenCalledWith('id_qualquer')
  })

  test('Deve retornar um erro caso o Encriptador retorne um erro', async () => {
    const { sut, encriptadorStub } = makeSut()
    jest.spyOn(encriptadorStub, 'encriptar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    const promise = sut.autenticar(autenticacao)
    await expect(promise).rejects.toThrow()
  })

  test('Deve retornar um token em caso de sucesso', async () => {
    const { sut } = makeSut()
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    const token = await sut.autenticar(autenticacao)
    expect(token).toBe('token_qualquer')
  })
})
