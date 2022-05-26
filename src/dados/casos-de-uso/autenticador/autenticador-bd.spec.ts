import { Autenticador } from '../../../dominio/casos-de-uso/autenticador/autenticador'
import { ModeloFuncionario } from '../../../dominio/modelos/cadastrofuncionario'
import { RepositorioConsultaFuncionarioPorEmail } from '../../protocolos/bd/repositorio-consulta-funcionario-por-email'
import { AutenticadorBD } from './autenticador-bd'
import { ComparadorHash } from '../../protocolos/criptografia/comparador-hash'
import { GeradorDeToken } from '../../protocolos/criptografia/gerador-de-token'

const makeRepositorioConsultaFuncionarioPorEmail = (): RepositorioConsultaFuncionarioPorEmail => {
  class RepositorioConsultaFuncionarioPorEmailStub implements RepositorioConsultaFuncionarioPorEmail {
    async consulta (email: string): Promise<ModeloFuncionario> {
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

const makeGeradorDeToken = (): GeradorDeToken => {
  class GeradorDeTokenStub implements GeradorDeToken {
    async gerar (id: string): Promise<string > {
      return await new Promise(resolve => resolve('token_qualquer'))
    }
  }
  return new GeradorDeTokenStub()
}

interface SubTipos {
  sut: Autenticador
  repositorioConsultaFuncionarioPorEmailStub: RepositorioConsultaFuncionarioPorEmail
  comparadorHashStub: ComparadorHash
  geradorDeTokenStub: GeradorDeToken
}

const makeSut = (): SubTipos => {
  const repositorioConsultaFuncionarioPorEmailStub = makeRepositorioConsultaFuncionarioPorEmail()
  const comparadorHashStub = makeComparadorHash()
  const geradorDeTokenStub = makeGeradorDeToken()
  const sut = new AutenticadorBD(repositorioConsultaFuncionarioPorEmailStub, comparadorHashStub, geradorDeTokenStub)
  return {
    sut,
    repositorioConsultaFuncionarioPorEmailStub,
    comparadorHashStub,
    geradorDeTokenStub
  }
}

describe('Autenticação no banco de dados', () => {
  test('Deve chamar RepositorioConsultaFuncionarioPorEmail com o email correto', async () => {
    const { sut, repositorioConsultaFuncionarioPorEmailStub } = makeSut()
    const consultaSpy = jest.spyOn(repositorioConsultaFuncionarioPorEmailStub, 'consulta')
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    await sut.autenticar(autenticacao)
    expect(consultaSpy).toHaveBeenCalledWith('email_qualquer@mail.com')
  })

  test('Deve retornar um erro caso o RepositorioConsultaFuncionarioPorEmail retorne um erro', async () => {
    const { sut, repositorioConsultaFuncionarioPorEmailStub } = makeSut()
    jest.spyOn(repositorioConsultaFuncionarioPorEmailStub, 'consulta').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    const promise = sut.autenticar(autenticacao)
    await expect(promise).rejects.toThrow()
  })

  test('Deve retornar null caso o RepositorioConsultaFuncionarioPorEmail retorne null', async () => {
    const { sut, repositorioConsultaFuncionarioPorEmailStub } = makeSut()
    jest.spyOn(repositorioConsultaFuncionarioPorEmailStub, 'consulta').mockReturnValueOnce(null)
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

  test('Deve chamar o GeradorDeToken com o id correto', async () => {
    const { sut, geradorDeTokenStub } = makeSut()
    const gerarSpy = jest.spyOn(geradorDeTokenStub, 'gerar')
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    await sut.autenticar(autenticacao)
    expect(gerarSpy).toHaveBeenCalledWith('id_qualquer')
  })

  test('Deve retornar um erro caso o GeradorDeToken retorne um erro', async () => {
    const { sut, geradorDeTokenStub } = makeSut()
    jest.spyOn(geradorDeTokenStub, 'gerar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    const promise = sut.autenticar(autenticacao)
    await expect(promise).rejects.toThrow()
  })
})
