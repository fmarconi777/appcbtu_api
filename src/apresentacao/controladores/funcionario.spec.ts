import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ControladorDeFuncionario } from './funcionario'
import { Validador } from '../protocolos/validador'
import { ErroDeServidor } from '../erros/erro-de-servidor'

interface SutTipos {
  sut: ControladorDeFuncionario
  validadorDeEmailStub: Validador
}
const makeSut = (): SutTipos => {
  class ValidadorDeEmailStub implements Validador {
    validar (email: string): boolean {
      return true
    }
  }
  const validadorDeEmailStub = new ValidadorDeEmailStub()
  const sut = new ControladorDeFuncionario(validadorDeEmailStub)
  return {
    sut,
    validadorDeEmailStub
  }
}

describe('Controlador de Cadastro', () => {
  test('Retornar 400 quando o nome não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        area: 'qualquer_area',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('nome'))
  })
  test('Retornar 400 quando o email não for fornecido', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    jest.spyOn(validadorDeEmailStub, 'validar').mockReturnValueOnce(false)
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        area: 'qualquer_area',
        senha: 'qualquer_senha',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('email'))
  })
  test('Deverá chamar ValidadorDeEmail quando o email correto for fornecido', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    const validarEspionar = jest.spyOn(validadorDeEmailStub, 'validar')
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        area: 'qualquer_area',
        senha: 'qualquer_senha',
        confirmarSenha: 'qualquer_senha'
      }
    }
    await sut.tratar(requisicaoHttp)
    expect(validarEspionar).toHaveBeenLastCalledWith('qualquer_email@mail.com')
  })
  test('Retornar 500 quando o ValidadorDeEmail retornar uma excessão', async () => {
    class ValidadorDeEmailStub implements Validador {
      validar (email: string): boolean {
        throw new Error()
      }
    }
    const validadorDeEmailStub = new ValidadorDeEmailStub()
    const sut = new ControladorDeFuncionario(validadorDeEmailStub)
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        area: 'qualquer_area',
        senha: 'qualquer_senha',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(500)
    expect(respostaHttp.corpo).toEqual(new ErroDeServidor())
  })

  test('Retornar 400 quando a area não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('area'))
  })
  test('Retornar 400 quando a senha não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        area: 'qualquer_area',
        email: 'qualquer_email@mail.com',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('senha'))
  })
  test('Retornar 400 quando o confirmarsenha não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        area: 'qualquer_area',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('confirmarSenha'))
  })
})
