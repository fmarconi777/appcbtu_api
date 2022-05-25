import { Autenticador } from '../../../dominio/casos-de-uso/autenticador/autenticador'
import { ModeloFuncionario } from '../../../dominio/modelos/cadastrofuncionario'
import { RepositorioConsultaContaPorEmail } from '../../protocolos/repositorio-consulta-conta-por-email'
import { AutenticadorBD } from './autenticador-bd'

const makeRepositorioConsultaContaPorEmail = (): RepositorioConsultaContaPorEmail => {
  class RepositorioConsultaContaPorEmailStub implements RepositorioConsultaContaPorEmail {
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
  return new RepositorioConsultaContaPorEmailStub()
}

interface SubTipos {
  sut: Autenticador
  repositorioConsultaContaPorEmail: RepositorioConsultaContaPorEmail
}

const makeSut = (): SubTipos => {
  const repositorioConsultaContaPorEmail = makeRepositorioConsultaContaPorEmail()
  const sut = new AutenticadorBD(repositorioConsultaContaPorEmail)
  return {
    sut,
    repositorioConsultaContaPorEmail
  }
}

describe('Autenticação no banco de dados', () => {
  test('Deve chamar RepositorioConsultaContaPorEmail com o email correto', async () => {
    const { sut, repositorioConsultaContaPorEmail } = makeSut()
    const consultaSpy = jest.spyOn(repositorioConsultaContaPorEmail, 'consulta')
    const autenticacao = {
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    }
    await sut.autenticar(autenticacao)
    expect(consultaSpy).toHaveBeenCalledWith('email_qualquer@mail.com')
  })
})
