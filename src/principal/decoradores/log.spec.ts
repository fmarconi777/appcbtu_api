import { Controlador } from '../../apresentacao/protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../../apresentacao/protocolos/http'
import { DecoradorControladorLog } from './log'

const makeControlador = (): Controlador => {
  class ControladorStub implements Controlador {
    async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
      const respostaHttp: RespostaHttp = {
        status: 200,
        corpo: {
          estacao: 'uma estação'
        }
      }
      return await new Promise(resolve => resolve(respostaHttp))
    }
  }
  return new ControladorStub()
}

interface SubTypes {
  sut: DecoradorControladorLog
  controladorStub: Controlador
}

const makeStu = (): SubTypes => {
  const controladorStub = makeControlador()
  const sut = new DecoradorControladorLog(controladorStub)
  return {
    sut,
    controladorStub
  }
}

describe('Decorador do ControladorLog', () => {
  test('Deve chamar o metodo tratar do controlador', async () => {
    const { sut, controladorStub } = makeStu()
    const tratarSpy = jest.spyOn(controladorStub, 'tratar')
    const requisicaoHttp = {
      parametro: 'usg'
    }
    await sut.tratar(requisicaoHttp)
    expect(tratarSpy).toHaveBeenCalledWith(requisicaoHttp)
  })
})
