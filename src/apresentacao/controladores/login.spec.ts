import { ControladorDeLogin } from './login'
import { Autenticador, ModeloAutenticacao } from '@/dominio/casos-de-uso/autenticador/autenticador'
import { ErroDeServidor } from '@/apresentacao/erros/erro-de-servidor'
import { ErroFaltaParametro } from '@/apresentacao/erros/erro-falta-parametro'
import { ErroParametroInvalido } from '@/apresentacao/erros/erro-parametro-invalido'
import { Validador } from '@/apresentacao/protocolos/validador'
import { ErroDeAutorizacao } from '@/apresentacao/erros/erro-nao-autorizado'
import { ErroMetodoInvalido } from '@/apresentacao/erros/erro-metodo-invalido'
import { requisicaoNaoAutorizada } from '@/apresentacao/auxiliares/auxiliar-http'

const makeValidadorDeEmail = (): Validador => {
  class ValidadorDeEmailStub implements Validador {
    validar (email: string): boolean {
      return true
    }
  }
  return new ValidadorDeEmailStub()
}

const makeAutenticador = (): Autenticador => {
  class AutenticadorStub implements Autenticador {
    async autenticar (atenticacao: ModeloAutenticacao): Promise<string> {
      return await new Promise(resolve => resolve('token_qualquer'))
    }
  }
  return new AutenticadorStub()
}

interface SubTipos {
  sut: ControladorDeLogin
  validadorDeEmailStub: Validador
  autenticadorStub: Autenticador
}

const makeSut = (): SubTipos => {
  const validadorDeEmailStub = makeValidadorDeEmail()
  const autenticadorStub = makeAutenticador()
  const sut = new ControladorDeLogin(validadorDeEmailStub, autenticadorStub)
  return {
    sut,
    validadorDeEmailStub,
    autenticadorStub
  }
}

describe('Controlador de login', () => {
  test('Deve retornar erro 400 se o email não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        senha: 'senha_qualquer'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('email'))
  })

  test('Deve retornar erro 400 se a senha não for fornecida', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('senha'))
  })

  test('Deve chamar o ValidadorDeEmail com o parametro correto', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    const validadorSpy = jest.spyOn(validadorDeEmailStub, 'validar')
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      },
      metodo: 'POST'
    }
    await sut.tratar(requisicaoHttp)
    expect(validadorSpy).toHaveBeenCalledWith('email_qualquer@mail.com')
  })

  test('Deve retornar erro 400 se o email fornecido não for válido', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    jest.spyOn(validadorDeEmailStub, 'validar').mockReturnValueOnce(false)
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('email'))
  })

  test('Deve retornar erro 500 se o validador de email retornar um erro', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    const erroFalso = new Error()
    erroFalso.stack = 'stack_qualquer'
    jest.spyOn(validadorDeEmailStub, 'validar').mockImplementationOnce(() => {
      throw erroFalso
    })
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(500)
    expect(respostaHttp.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
  })

  test('Deve chamar o Autenticador com os parametros corretos', async () => {
    const { sut, autenticadorStub } = makeSut()
    const autenticarSpy = jest.spyOn(autenticadorStub, 'autenticar')
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      },
      metodo: 'POST'
    }
    await sut.tratar(requisicaoHttp)
    expect(autenticarSpy).toHaveBeenCalledWith({
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    })
  })

  test('Deve retornar erro 401 se parametros inválidos forem passados', async () => {
    const { sut, autenticadorStub } = makeSut()
    jest.spyOn(autenticadorStub, 'autenticar').mockReturnValueOnce(new Promise(resolve => resolve('')))
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp).toEqual(requisicaoNaoAutorizada(new ErroDeAutorizacao()))
  })

  test('Deve retornar erro 500 se o autenticador retornar um erro', async () => {
    const { sut, autenticadorStub } = makeSut()
    const erroFalso = new Error()
    erroFalso.stack = 'stack_qualquer'
    jest.spyOn(autenticadorStub, 'autenticar').mockImplementationOnce(() => {
      throw erroFalso
    })
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(500)
    expect(respostaHttp.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
  })

  test('Deve retornar erro 200 se parametros válidos forem passados', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(200)
    expect(respostaHttp.corpo).toEqual({ tokenDeAcesso: 'token_qualquer' })
  })

  test('Deve retornar codigo 400 se um método não suportado for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      },
      metodo: 'metodo_invalido'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroMetodoInvalido())
  })
})
