import { requisicaoImpropria } from '../auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
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

  describe('Método POST', () => {
    test('Deve retornar status 400 caso o parametro numero não seja fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          estacaoId: '1'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoImpropria(new ErroFaltaParametro('numero')))
    })

    test('Deve retornar status 400 caso o parametro estacaoId não seja fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          numero: '3132505555'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoImpropria(new ErroFaltaParametro('estacaoId')))
    })
  })
})
