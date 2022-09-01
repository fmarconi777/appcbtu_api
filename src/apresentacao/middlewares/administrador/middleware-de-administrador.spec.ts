import { CadastroAdministrador } from '../../../dominio/casos-de-uso/middleware/administrador/cadastro-de-adminstrador'
import { ConsultaAdministrador } from '../../../dominio/casos-de-uso/middleware/administrador/consulta-administrador'
import { MiddlewareDeAdministrador } from './middleware-de-administrador'
import ReadLine from 'node:readline'
import { Validador } from '../../protocolos/validador'

const makeConsultaAdministradorStub = (): ConsultaAdministrador => {
  class ConsultaAdministradorStub implements ConsultaAdministrador {
    async consultar (): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new ConsultaAdministradorStub()
}

const makeValidadorDeEmailStub = (): Validador => {
  class ValidadorDeEmailStub implements Validador {
    validar (email: string): boolean {
      return true
    }
  }
  return new ValidadorDeEmailStub()
}

const makeCadastroAdministradorStub = (): CadastroAdministrador => {
  class CadastroAdministradorStub implements CadastroAdministrador {
    async cadastrar (senha: string, email: string): Promise<string> {
      return await Promise.resolve('Conta admin cadastrada com sucesso')
    }
  }
  return new CadastroAdministradorStub()
}

interface SubTipos {
  sut: MiddlewareDeAdministrador
  consultaAdministradorStub: ConsultaAdministrador
  validadorDeEmailStub: Validador
  cadastroAdministradorStub: CadastroAdministrador
}

const makeSut = (): SubTipos => {
  const validadorDeEmailStub = makeValidadorDeEmailStub()
  const cadastroAdministradorStub = makeCadastroAdministradorStub()
  const consultaAdministradorStub = makeConsultaAdministradorStub()
  const sut = new MiddlewareDeAdministrador(consultaAdministradorStub, validadorDeEmailStub, cadastroAdministradorStub)
  return {
    sut,
    consultaAdministradorStub,
    validadorDeEmailStub,
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

  test('Deve chamar o ValidadorDeEmail com o parametro correto', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    const validadorSpy = jest.spyOn(validadorDeEmailStub, 'validar')
    jest.spyOn(ReadLine, 'createInterface').mockReturnValueOnce({
      question: jest.fn().mockImplementationOnce((texto, input) => input('senha')).mockImplementationOnce((texto, input) => input('email_qualquer@mail.com')),
      close: jest.fn().mockImplementationOnce(() => undefined)
    } as any)
    await sut.tratarInput()
    expect(validadorSpy).toHaveBeenCalledWith('email_qualquer@mail.com')
  })

  test('Deve retornar um erro caso o ValidadorDeEmail retorne um erro', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    const validadorSpy = jest.spyOn(validadorDeEmailStub, 'validar').mockImplementationOnce(() => { throw new Error() })
    jest.spyOn(ReadLine, 'createInterface').mockReturnValueOnce({
      question: jest.fn().mockImplementationOnce((texto, input) => input('senha')).mockImplementationOnce((texto, input) => input('email_qualquer@mail.com')),
      close: jest.fn().mockImplementationOnce(() => undefined)
    } as any)
    const resposta = await sut.tratarInput()
    expect(resposta).toBeUndefined()
    expect(validadorSpy).toHaveBeenCalled()
  })

  test('Deve chamar o cadastroAdministrador com o valor correto depois que o usuário inserir um valor', async () => {
    const { sut, cadastroAdministradorStub } = makeSut()
    const cadastrarSpy = jest.spyOn(cadastroAdministradorStub, 'cadastrar')
    jest.spyOn(ReadLine, 'createInterface').mockReturnValueOnce({
      question: jest.fn().mockImplementationOnce((texto, input) => input('senha')).mockImplementationOnce((texto, input) => input('email_qualquer@mail.com')),
      close: jest.fn().mockImplementationOnce(() => undefined)
    } as any)
    await sut.tratarInput()
    expect(cadastrarSpy).toHaveBeenCalledWith('senha', 'email_qualquer@mail.com')
  })

  test('Deve retornar um erro caso o cadastroAdministrador retorne um erro', async () => {
    const { sut, cadastroAdministradorStub } = makeSut()
    const cadastrarSpy = jest.spyOn(cadastroAdministradorStub, 'cadastrar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = await sut.tratarInput()
    expect(resposta).toBeUndefined()
    expect(cadastrarSpy).toHaveBeenCalled()
  })
})
