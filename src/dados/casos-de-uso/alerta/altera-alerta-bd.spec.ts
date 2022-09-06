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

interface SubTipos {
  sut: AlteraAlertaBD
  validadorDeAlertaStub: ValidadorBD
}

const makeSut = (): SubTipos => {
  const validadorDeAlertaStub = makeValidadorDeAlertaStub()
  const sut = new AlteraAlertaBD(validadorDeAlertaStub)
  return {
    sut,
    validadorDeAlertaStub
  }
}

describe('AlteraAlertaBD', () => {
  test('Deve chamar o consultaAlertaPorId com o parametro correto', async () => {
    const { sut, validadorDeAlertaStub } = makeSut()
    const validarSpy = jest.spyOn(validadorDeAlertaStub, 'validar')
    await sut.alterar(dados)
    expect(validarSpy).toHaveBeenCalledWith(+dados.id)
  })

  test('Deve retornar um erro caso o consultaAlertaPorId retorne um erro', async () => {
    const { sut, validadorDeAlertaStub } = makeSut()
    jest.spyOn(validadorDeAlertaStub, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.alterar(dados)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar null caso o consultaAlertaPorId retorne null', async () => {
    const { sut, validadorDeAlertaStub } = makeSut()
    jest.spyOn(validadorDeAlertaStub, 'validar').mockReturnValueOnce(Promise.resolve(false))
    const resposta = await sut.alterar(dados)
    expect(resposta).toBeNull()
  })
})
