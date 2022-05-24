import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ControladorDeLogin } from './login'

interface SubTipos {
  sut: ControladorDeLogin
}

const makeSut = (): SubTipos => {
  const sut = new ControladorDeLogin()
  return {
    sut
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
})
