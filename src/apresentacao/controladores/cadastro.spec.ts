import { ControladorDeCadastro } from './cadastro'

describe('Controlador de Cadastro', () => {
  test('Retornar 400 quando o nome não for fornecido', () => {
    const sut = new ControladorDeCadastro()
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
    expect(respostaHttp.corpo).toEqual(new Error('Falta parametro: nome '))
  })
})
