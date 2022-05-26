import { Autenticador } from '../../../dominio/casos-de-uso/autenticador/autenticador'
import { ModeloFuncionario } from '../../../dominio/modelos/cadastrofuncionario'
import { RepositorioConsultaFuncionarioPorEmail } from '../../protocolos/bd/repositorio-consulta-funcionario-por-email'
import { AutenticadorBD } from './autenticador-bd'
import { ComparadorHash } from '../../protocolos/criptografia/comparador-hash'

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

interface SubTipos {
  sut: Autenticador
  repositorioConsultaFuncionarioPorEmail: RepositorioConsultaFuncionarioPorEmail
  comparadorHashStub: ComparadorHash
}

const makeSut = (): SubTipos => {
  const repositorioConsultaFuncionarioPorEmail = makeRepositorioConsultaFuncionarioPorEmail()
  const comparadorHashStub = makeComparadorHash()
  const sut = new AutenticadorBD(repositorioConsultaFuncionarioPorEmail, comparadorHashStub)
  return {
    sut,
    repositorioConsultaFuncionarioPorEmail,
    comparadorHashStub
  }
}

describe('Autenticação no banco de dados', () => {
  test('Deve chamar RepositorioConsultaFuncionarioPorEmail com o email correto', async () => {
    const { sut, repositorioConsultaFuncionarioPorEmail } = makeSut()
    const consultaSpy = jest.spyOn(repositorioConsultaFuncionarioPorEmail, 'consulta')
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    await sut.autenticar(autenticacao)
    expect(consultaSpy).toHaveBeenCalledWith('email_qualquer@mail.com')
  })

  test('Deve retornar um erro caso o RepositorioConsultaFuncionarioPorEmail retorne um erro', async () => {
    const { sut, repositorioConsultaFuncionarioPorEmail } = makeSut()
    jest.spyOn(repositorioConsultaFuncionarioPorEmail, 'consulta').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    const promise = sut.autenticar(autenticacao)
    await expect(promise).rejects.toThrow()
  })

  test('Deve retornar null caso o RepositorioConsultaFuncionarioPorEmail retorne null', async () => {
    const { sut, repositorioConsultaFuncionarioPorEmail } = makeSut()
    jest.spyOn(repositorioConsultaFuncionarioPorEmail, 'consulta').mockReturnValueOnce(null)
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
})
