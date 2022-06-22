import { Controlador } from '../../apresentacao/protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../../apresentacao/protocolos/http'
import { DecoradorControladorLog } from './log'
import { erroDeServidor } from '../../apresentacao/auxiliares/auxiliar-http'
import { RepositorioLogDeErro } from '../../dados/protocolos/bd/log-de-erro/repositorio-log-de-erro'

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

const makeRepositorioLogDeErro = (): RepositorioLogDeErro => {
  class RepositorioLogDeErroStub implements RepositorioLogDeErro {
    async logErro (stack: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new RepositorioLogDeErroStub()
}

interface SubTypes {
  sut: DecoradorControladorLog
  controladorStub: Controlador
  repositorioLogDeErroStub: RepositorioLogDeErro
}

const makeStu = (): SubTypes => {
  const controladorStub = makeControlador()
  const repositorioLogDeErroStub = makeRepositorioLogDeErro()
  const sut = new DecoradorControladorLog(controladorStub, repositorioLogDeErroStub)
  return {
    sut,
    controladorStub,
    repositorioLogDeErroStub
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
  test('Deve retornar o mesmo resultado que o controlador', async () => {
    const { sut } = makeStu()
    const requisicaoHttp = {
      parametro: 'usg'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp).toEqual({
      status: 200,
      corpo: {
        estacao: 'uma estação'
      }
    })
  })
  test('Deve chamar o RepositorioLogDeErro com o valor correto de erro se o controlador retornar um erro de servidor', async () => {
    const { sut, controladorStub, repositorioLogDeErroStub } = makeStu()
    const erroFalso = new Error()
    erroFalso.stack = 'stack_qualquer'
    const erro = erroDeServidor(erroFalso)
    const logSpy = jest.spyOn(repositorioLogDeErroStub, 'logErro')
    jest.spyOn(controladorStub, 'tratar').mockReturnValueOnce(new Promise(resolve => (resolve(erro))))
    const requisicaoHttp = {
      parametro: 'usg'
    }
    await sut.tratar(requisicaoHttp)
    expect(logSpy).toHaveBeenCalledWith('stack_qualquer')
  })
})
