import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ControladorDeFalha } from './falha'

const falhaFalsa = {
  numFalha: 'numero_qualquer',
  equipamentoId: 'equipamentoId_qualquer'
}

interface SubTipos {
  sut: ControladorDeFalha
}

const makeSut = (): SubTipos => {
  const sut = new ControladorDeFalha()
  return {
    sut
  }
}

describe('ControladorDeFalha', () => {
  test('Deve retornar codigo 400 se um método não suportado for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: falhaFalsa,
      metodo: 'metodo_invalido'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroMetodoInvalido())
  })
})
