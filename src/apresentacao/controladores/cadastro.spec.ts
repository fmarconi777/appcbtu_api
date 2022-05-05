import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ControladorDeCadastro } from './cadastro'

const makeSut = (): ControladorDeCadastro => {
  return new ControladorDeCadastro()
}

describe('Controlador de Cadastro', () => {
  test('Retornar 400 quando o nome não for fornecido', async () => {
    const sut = makeSut()
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
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('nome'))
  })
  test('Retornar 400 quando o email não for fornecido', async () => {
    const sut = makeSut()
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
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('email'))
  })
  test('Retornar 400 quando a area não for fornecido', async () => {
    const sut = makeSut()
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
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('area'))
  })
  test('Retornar 400 quando a senha não for fornecido', async () => {
    const sut = makeSut()
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
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('senha'))
  })
  test('Retornar 400 quando o confirmarsenha não for fornecido', async () => {
    const sut = makeSut()
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
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('confirmarSenha'))
  })
})
