import { Autenticador } from '../../../dominio/casos-de-uso/autenticador/autenticador'
import { ModeloFuncionario } from '../../../dominio/modelos/cadastrofuncionario'
import { RepositorioConsultaFuncionarioPorEmail } from '../../protocolos/repositorio-consulta-conta-por-email'
import { AutenticadorBD } from './autenticador-bd'

const makeRepositorioConsultaFuncionarioPorEmail = (): RepositorioConsultaFuncionarioPorEmail => {
  class RepositorioConsultaFuncionarioPorEmailStub implements RepositorioConsultaFuncionarioPorEmail {
    async consulta (email: string): Promise<ModeloFuncionario> {
      const funcionarioFalso: ModeloFuncionario = {
        id: 'qualquer_id',
        nome: 'qualquer_nome',
        email: 'qualquer_email',
        senha: 'qualquer_senha',
        administrador: 'false',
        areaId: 'qualquer_areaId'
      }
      return await new Promise(resolve => resolve(funcionarioFalso))
    }
  }
  return new RepositorioConsultaFuncionarioPorEmailStub()
}

interface SubTipos {
  sut: Autenticador
  repositorioConsultaFuncionarioPorEmail: RepositorioConsultaFuncionarioPorEmail
}

const makeSut = (): SubTipos => {
  const repositorioConsultaFuncionarioPorEmail = makeRepositorioConsultaFuncionarioPorEmail()
  const sut = new AutenticadorBD(repositorioConsultaFuncionarioPorEmail)
  return {
    sut,
    repositorioConsultaFuncionarioPorEmail
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
})
