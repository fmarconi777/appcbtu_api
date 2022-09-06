import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { AlteraAlertaBD } from './altera-alerta-bd'

const dados: ModeloAlerta = {
  id: '1',
  descricao: 'qualquer_descricao',
  prioridade: 'qualquer_prioridade',
  dataInicio: 'inicio_qualquer',
  dataFim: 'fim_qualquer',
  ativo: 'true',
  estacaoId: '1'
}

const makeValidadorDeAlertaStub = (): ValidadorBD => {
  class ValidadorDeAlertaStub implements ValidadorBD {
    async validar (id: number): Promise<boolean> {
      return true
    }
  }
  return new ValidadorDeAlertaStub()
}

const makeValidadorDeEstacaoStub = (): ValidadorBD => {
  class ValidadorDeEstacaoStub implements ValidadorBD {
    async validar (id: number): Promise<boolean> {
      return true
    }
  }
  return new ValidadorDeEstacaoStub()
}

interface SubTipos {
  sut: AlteraAlertaBD
  validadorDeAlertaStub: ValidadorBD
  validadorDeEstacaoStub: ValidadorBD
}

const makeSut = (): SubTipos => {
  const validadorDeEstacaoStub = makeValidadorDeEstacaoStub()
  const validadorDeAlertaStub = makeValidadorDeAlertaStub()
  const sut = new AlteraAlertaBD(validadorDeAlertaStub, validadorDeEstacaoStub)
  return {
    sut,
    validadorDeAlertaStub,
    validadorDeEstacaoStub
  }
}

describe('AlteraAlertaBD', () => {
  test('Deve chamar o validadorDeAlerta com o parametro correto', async () => {
    const { sut, validadorDeAlertaStub } = makeSut()
    const validarSpy = jest.spyOn(validadorDeAlertaStub, 'validar')
    await sut.alterar(dados)
    expect(validarSpy).toHaveBeenCalledWith(+dados.id)
  })

  test('Deve retornar um erro caso o validadorDeAlerta retorne um erro', async () => {
    const { sut, validadorDeAlertaStub } = makeSut()
    jest.spyOn(validadorDeAlertaStub, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.alterar(dados)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar { valido: false, resposta: id } caso o validadorDeAlerta retorne false', async () => {
    const { sut, validadorDeAlertaStub } = makeSut()
    jest.spyOn(validadorDeAlertaStub, 'validar').mockReturnValueOnce(Promise.resolve(false))
    const resposta = await sut.alterar(dados)
    expect(resposta).toEqual({ valido: false, resposta: 'id' })
  })

  test('Deve chamar o validadorDeEstacao com o parametro correto', async () => {
    const { sut, validadorDeEstacaoStub } = makeSut()
    const validarSpy = jest.spyOn(validadorDeEstacaoStub, 'validar')
    await sut.alterar(dados)
    expect(validarSpy).toHaveBeenCalledWith(+dados.estacaoId)
  })

  test('Deve retornar um erro caso o validadorDeEstacao retorne um erro', async () => {
    const { sut, validadorDeEstacaoStub } = makeSut()
    jest.spyOn(validadorDeEstacaoStub, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.alterar(dados)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar { valido: false, resposta: estacaoId } caso o validadorDeEstacao retorne false', async () => {
    const { sut, validadorDeEstacaoStub } = makeSut()
    jest.spyOn(validadorDeEstacaoStub, 'validar').mockReturnValueOnce(Promise.resolve(false))
    const resposta = await sut.alterar(dados)
    expect(resposta).toEqual({ valido: false, resposta: 'estacaoId' })
  })
})
