import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { Validador } from '../protocolos/validador'
import { ControladorDeLogin } from './login'

interface SubTipos {
  sut: ControladorDeLogin
  validadorDeEmailStub: Validador
}

const makeValidadorDeEmail = (): Validador => {
  class ValidadorDeEmailStub implements Validador {
    validar (email: string): boolean {
      return true
    }
  }
  return new ValidadorDeEmailStub()
}

const makeSut = (): SubTipos => {
  const validadorDeEmailStub = makeValidadorDeEmail()
  const sut = new ControladorDeLogin(validadorDeEmailStub)
  return {
    sut,
    validadorDeEmailStub
  }
}

describe('Controlador de login', () => {
  test('Deve retornar erro 400 se o email não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        senha: 'senha_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('email'))
  })

  test('Deve retornar erro 400 se a senha não for fornecida', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer'
      }
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
        email: 'email_qualquer',
        senha: 'senha_qualquer'
      }
    }
    await sut.tratar(requisicaoHttp)
    expect(validadorSpy).toHaveBeenCalledWith('email_qualquer')
  })

  test('Deve retornar erro 400 se o email fornecido não for válido', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    jest.spyOn(validadorDeEmailStub, 'validar').mockReturnValueOnce(false)
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer',
        senha: 'senha_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('email'))
  })
})
