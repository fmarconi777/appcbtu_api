import { ModeloFalha } from '../../../dominio/modelos/falha'
import { RepositorioConsultaFalha } from '../../protocolos/bd/falha/repositorio-consulta-falha'
import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'
import { AlteraFalhaBD } from './altera-falha-bd'

const falhaFalsa = {
  id: '1',
  numFalha: 'numero_qualquer',
  dataCriacao: '2022-01-01T00:00:00Z',
  equipamentoId: '1'
}

const FalhaAlterada = {
  id: 1,
  numFalha: 0,
  equipamentoId: 1
}

const makeRepositorioConsultaFalhaStub = (): RepositorioConsultaFalha => {
  class RepositorioConsultaFalhaStub implements RepositorioConsultaFalha {
    async consultar (id?: number | undefined): Promise<ModeloFalha | ModeloFalha[] | null> {
      return falhaFalsa
    }
  }
  return new RepositorioConsultaFalhaStub()
}
const makeValidaEquipamentoStub = (): ValidadorBD => {
  class ValidaEquipamentoStub implements ValidadorBD {
    async validar (parametro: any): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new ValidaEquipamentoStub()
}

interface SubTipos {
  sut: AlteraFalhaBD
  repositorioConsultaFalhaStub: RepositorioConsultaFalha
  validaEquipamentoStub: ValidadorBD
}

const makeSut = (): SubTipos => {
  const validaEquipamentoStub = makeValidaEquipamentoStub()
  const repositorioConsultaFalhaStub = makeRepositorioConsultaFalhaStub()
  const sut = new AlteraFalhaBD(repositorioConsultaFalhaStub, validaEquipamentoStub)
  return {
    sut,
    repositorioConsultaFalhaStub,
    validaEquipamentoStub
  }
}

describe('AlteraFalhaBD', () => {
  test('Deve chamar o método consultar do RepositorioConsultaFalha com o parâmetro correto', async () => {
    const { sut, repositorioConsultaFalhaStub } = makeSut()
    const consultarSpy = jest.spyOn(repositorioConsultaFalhaStub, 'consultar')
    await sut.alterar(FalhaAlterada)
    expect(consultarSpy).toHaveBeenCalledWith(FalhaAlterada.id)
  })

  test('Deve retornar um erro caso o método consultar retorne um erro', async () => {
    const { sut, repositorioConsultaFalhaStub } = makeSut()
    jest.spyOn(repositorioConsultaFalhaStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.alterar(FalhaAlterada)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar falhaInvalida: true e parametro: id caso o método consultar retorne null', async () => {
    const { sut, repositorioConsultaFalhaStub } = makeSut()
    jest.spyOn(repositorioConsultaFalhaStub, 'consultar').mockReturnValueOnce(Promise.resolve(null))
    const resposta = await sut.alterar(FalhaAlterada)
    expect(resposta).toEqual({
      falhaInvalida: true,
      parametro: 'id'
    })
  })

  test('Deve chamar o validadorDeEquipamento com o parâmetro correto', async () => {
    const { sut, validaEquipamentoStub } = makeSut()
    const validarSpy = jest.spyOn(validaEquipamentoStub, 'validar')
    await sut.alterar(FalhaAlterada)
    expect(validarSpy).toHaveBeenCalledWith(FalhaAlterada.id)
  })

  test('Deve retornar um erro caso o validadorDeEquipamento retorne um erro', async () => {
    const { sut, validaEquipamentoStub } = makeSut()
    jest.spyOn(validaEquipamentoStub, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.alterar(FalhaAlterada)
    await expect(resposta).rejects.toThrow()
  })
})
