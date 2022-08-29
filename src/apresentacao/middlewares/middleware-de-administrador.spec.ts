import { CadastroAdministrador } from '../../dominio/casos-de-uso/middleware/cadastro-de-adminstrador'
import { ConsultaAdministrador } from '../../dominio/casos-de-uso/middleware/consulta-administrador'
import { MiddlewareDeAdministrador } from './middleware-de-administrador'
import ReadLine from 'node:readline'

const makeConsultaAdministradorStub = (): ConsultaAdministrador => {
  class ConsultaAdministradorStub implements ConsultaAdministrador {
    async consultar (): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new ConsultaAdministradorStub()
}

const makeCadastroAdministradorStub = (): CadastroAdministrador => {
  class CadastroAdministradorStub implements CadastroAdministrador {
    async cadastrar (senha: string): Promise<string> {
      return await Promise.resolve('Administrador cadastrado com sucesso!')
    }
  }
  return new CadastroAdministradorStub()
}

interface SubTipos {
  sut: MiddlewareDeAdministrador
  consultaAdministradorStub: ConsultaAdministrador
  cadastroAdministradorStub: CadastroAdministrador
}

const makeSut = (): SubTipos => {
  const cadastroAdministradorStub = makeCadastroAdministradorStub()
  const consultaAdministradorStub = makeConsultaAdministradorStub()
  const sut = new MiddlewareDeAdministrador(consultaAdministradorStub, cadastroAdministradorStub)
  return {
    sut,
    consultaAdministradorStub,
    cadastroAdministradorStub
  }
}

describe('Middleware de criação de conta de administrador', () => {
  test('Deve retornar um erro caso o consultaAdministrador retorne um erro', async () => {
    const { sut, consultaAdministradorStub } = makeSut()
    const consultarSpy = jest.spyOn(consultaAdministradorStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = await sut.tratarInput()
    expect(resposta).toBeUndefined()
    expect(consultarSpy).toHaveBeenCalled()
  })

  test('Deve chamar o cadastroAdministrador com o valor correto depois que o usuário inserir um valor', async () => {
    const { sut, cadastroAdministradorStub } = makeSut()
    const cadastrarSpy = jest.spyOn(cadastroAdministradorStub, 'cadastrar')
    jest.spyOn(ReadLine, 'createInterface').mockReturnValueOnce({
      question: jest.fn().mockImplementationOnce((texto, input) => input('123')),
      close: jest.fn().mockImplementationOnce(() => undefined)
    } as any)
    await sut.tratarInput()
    expect(cadastrarSpy).toHaveBeenCalledWith('123')
  })

  test('Deve retornar um erro caso o cadastroAdministrador retorne um erro', async () => {
    const { sut, cadastroAdministradorStub } = makeSut()
    const cadastrarSpy = jest.spyOn(cadastroAdministradorStub, 'cadastrar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = await sut.tratarInput()
    expect(resposta).toBeUndefined()
    expect(cadastrarSpy).toHaveBeenCalled()
  })
})
