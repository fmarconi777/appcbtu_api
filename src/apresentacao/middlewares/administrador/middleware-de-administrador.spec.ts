import { MiddlewareDeAdministrador } from './middleware-de-administrador'
import { CadastroAdministrador } from '@/dominio/casos-de-uso/middleware/administrador/cadastro-de-adminstrador'
import { ConsultaAdministrador } from '@/dominio/casos-de-uso/middleware/administrador/consulta-administrador'
import { LeitorDeTerminal } from '@/dominio/casos-de-uso/middleware/terminal/leitor-de-terminal'
import { LeitorDeSenhaTerminal } from '@/dominio/casos-de-uso/middleware/terminal/leitor-de-senha-terminal'
import { Validador } from '@/apresentacao/protocolos/validador'

const makeConsultaAdministradorStub = (): ConsultaAdministrador => {
  class ConsultaAdministradorStub implements ConsultaAdministrador {
    async consultar (): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new ConsultaAdministradorStub()
}

const makeCapturaEmailNoTerminalStub = (): LeitorDeTerminal => {
  class CapturaEmailNoTerminalStub implements LeitorDeTerminal {
    perguntarEmail (pergunta: any): string {
      return 'email_qualquer@mail.com'
    }
  }
  return new CapturaEmailNoTerminalStub()
}

const makeCapturaSenhaNoTerminalStub = (): LeitorDeSenhaTerminal => {
  class CapturaSenhaNoTerminalStub implements LeitorDeSenhaTerminal {
    perguntarSenha (pergunta: any): string {
      return 'senha'
    }
  }
  return new CapturaSenhaNoTerminalStub()
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
  capturaEmailNoTerminalStub: LeitorDeTerminal
  capturaSenhaNoTerminalStub: LeitorDeSenhaTerminal
  validadorDeEmailStub: Validador
  cadastroAdministradorStub: CadastroAdministrador
}

const makeSut = (): SubTipos => {
  const validadorDeEmailStub = makeValidadorDeEmailStub()
  const cadastroAdministradorStub = makeCadastroAdministradorStub()
  const capturaSenhaNoTerminalStub = makeCapturaSenhaNoTerminalStub()
  const capturaEmailNoTerminalStub = makeCapturaEmailNoTerminalStub()
  const consultaAdministradorStub = makeConsultaAdministradorStub()
  const sut = new MiddlewareDeAdministrador(consultaAdministradorStub, capturaEmailNoTerminalStub, capturaSenhaNoTerminalStub, validadorDeEmailStub, cadastroAdministradorStub)
  return {
    sut,
    consultaAdministradorStub,
    capturaEmailNoTerminalStub,
    capturaSenhaNoTerminalStub,
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

  test('Deve retornar undefined caso o consultaAdministrador retorne true', async () => {
    const { sut, consultaAdministradorStub } = makeSut()
    const consultarSpy = jest.spyOn(consultaAdministradorStub, 'consultar').mockReturnValueOnce(Promise.resolve(true))
    const resposta = await sut.tratarInput()
    expect(resposta).toBeUndefined()
    expect(consultarSpy).toHaveBeenCalled()
  })

  test('Deve chamar o capturaEmailNoTerminalStub com o valor correto', async () => {
    const { sut, capturaEmailNoTerminalStub } = makeSut()
    const perguntarEmailSpy = jest.spyOn(capturaEmailNoTerminalStub, 'perguntarEmail')
    await sut.tratarInput()
    expect(perguntarEmailSpy).toHaveBeenCalledWith('Insira um e-mail (ex: admin@admin.com.br) para a conta admin: ')
  })

  test('Deve retornar um erro caso o capturaInputNoTerminalStub retorne um erro', async () => {
    const { sut, capturaEmailNoTerminalStub } = makeSut()
    const perguntarEmailSpy = jest.spyOn(capturaEmailNoTerminalStub, 'perguntarEmail').mockImplementationOnce(() => { throw new Error() })
    const resposta = await sut.tratarInput()
    expect(resposta).toBeUndefined()
    expect(perguntarEmailSpy).toHaveBeenCalled()
  })

  test('Deve chamar o ValidadorDeEmail com o parametro correto', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    const validadorSpy = jest.spyOn(validadorDeEmailStub, 'validar')
    await sut.tratarInput()
    expect(validadorSpy).toHaveBeenCalledWith('email_qualquer@mail.com')
  })

  test('Deve encerrar o processo caso o ValidadorDeEmail retorne falso', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    jest.spyOn(validadorDeEmailStub, 'validar').mockReturnValueOnce(false)
    const resposta = await sut.tratarInput()
    expect(resposta).toBeUndefined()
  })

  test('Deve retornar um erro caso o ValidadorDeEmail retorne um erro', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    const validadorSpy = jest.spyOn(validadorDeEmailStub, 'validar').mockImplementationOnce(() => { throw new Error() })
    const resposta = await sut.tratarInput()
    expect(resposta).toBeUndefined()
    expect(validadorSpy).toHaveBeenCalled()
  })

  test('Deve chamar o capturaSenhaNoTerminalStub com o valor correto caso o e-mail esteja correto', async () => {
    const { sut, capturaSenhaNoTerminalStub } = makeSut()
    const perguntarSpy = jest.spyOn(capturaSenhaNoTerminalStub, 'perguntarSenha')
    await sut.tratarInput()
    expect(perguntarSpy).toHaveBeenCalledWith('Insira uma senha para a conta admin: ')
  })

  test('Deve retornar um erro caso o capturaSenhaNoTerminalStub retorne um erro', async () => {
    const { sut, capturaSenhaNoTerminalStub } = makeSut()
    const perguntarSpy = jest.spyOn(capturaSenhaNoTerminalStub, 'perguntarSenha').mockImplementationOnce(() => { throw new Error() })
    const resposta = await sut.tratarInput()
    expect(resposta).toBeUndefined()
    expect(perguntarSpy).toHaveBeenCalled()
  })

  test('Deve chamar o cadastroAdministrador com o valor correto depois que o usuário inserir um valor', async () => {
    const { sut, cadastroAdministradorStub } = makeSut()
    const cadastrarSpy = jest.spyOn(cadastroAdministradorStub, 'cadastrar')
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

  test('O método criarAdmin deve chamar o método tratarInput', () => {
    const { sut, consultaAdministradorStub } = makeSut()
    const tratarInputSpy = jest.spyOn(sut, 'tratarInput')
    jest.spyOn(consultaAdministradorStub, 'consultar').mockReturnValueOnce(Promise.resolve(true))
    const resposta = sut.criarAdmin()
    expect(resposta).toBeUndefined()
    expect(tratarInputSpy).toHaveBeenCalled()
  })
})
