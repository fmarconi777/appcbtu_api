import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ControladorDeTelefone } from './telefone'

interface SubTipos {
  sut: ControladorDeTelefone
}

const makeSut = (): SubTipos => {
  const sut = new ControladorDeTelefone()
  return {
    sut
  }
}

describe('Controlador de telefone', () => {
  test('Deve retornar codigo 400 se um método não suportado for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      metodo: 'metodo_invalido'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroMetodoInvalido())
  })
})
