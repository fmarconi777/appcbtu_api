import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ControladorDeCadastro } from './cadastro'

const makeSut = (): ControladorDeCadastro => {
  return new ControladorDeCadastro()
}

describe('Controlador de Cadastro', () => {
  test('Retornar 400 quando o nome não for fornecido', () => {
    const sut = makeSut()
    const requisicaoHttp = {
      corpo: {
        area: 'qualquer_area',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('nome'))
  })
  test('Retornar 400 quando o email não for fornecido', () => {
    const sut = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        area: 'qualquer_area',
        senha: 'qualquer_senha',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('email'))
  })
  test('Retornar 400 quando a area não for fornecido', () => {
    const sut = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('area'))
  })
  test('Retornar 400 quando a senha não for fornecido', () => {
    const sut = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        area: 'qualquer_area',
        email: 'qualquer_email@mail.com',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('senha'))
  })
  test('Retornar 400 quando o confirmarsenha não for fornecido', () => {
    const sut = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        area: 'qualquer_area',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha'
      }
    }
    const respostaHttp = sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('confirmarSenha'))
  })
})
