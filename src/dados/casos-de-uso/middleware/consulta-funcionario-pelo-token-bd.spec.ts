import { ConsultaFuncionarioPeloTokenBd } from './consulta-funcionario-pelo-token-bd'
import { Decriptador } from '../../protocolos/criptografia/decriptador'

const makeDecriptador = (): Decriptador => {
  class Decriptador implements Decriptador {
    async decriptar (valor: string): Promise<string> {
      return await new Promise(resolve => resolve('valor_qualquer'))
    }
  }
  return new Decriptador()
}

interface SubTipos {
  sut: ConsultaFuncionarioPeloTokenBd
  decriptador: Decriptador
}

const makeSut = (): SubTipos => {
  const decriptador = makeDecriptador()
  const sut = new ConsultaFuncionarioPeloTokenBd(decriptador)
  return {
    sut,
    decriptador
  }
}

describe('ConsultaFuncionarioPeloTokenBd', () => {
  test('Deve chamar o Decriptador com os valores corretos', async () => {
    const { sut, decriptador } = makeSut()
    const decriptarSpy = jest.spyOn(decriptador, 'decriptar')
    await sut.consultar('token_qualquer')
    expect(decriptarSpy).toHaveBeenCalledWith('token_qualquer')
  })
})
