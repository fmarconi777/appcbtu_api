import { FalhaAlterada } from '../../../dominio/casos-de-uso/falha/altera-falha'
import { ModeloFalha } from '../../../dominio/modelos/falha'
import { RepositorioAlteraFalha } from '../../protocolos/bd/falha/repositorio-altera-falha'
import { RepositorioConsultaFalha } from '../../protocolos/bd/falha/repositorio-consulta-falha'
import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'
import { AlteraFalhaBD } from './altera-falha-bd'

const falhaFalsa = {
  id: '1',
  numFalha: 'numero_qualquer',
  dataCriacao: '2022-01-01T00:00:00Z',
  equipamentoId: '1'
}

const falhaAlterada = {
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

const makeRepositorioAlteraFalhaStub = (): RepositorioAlteraFalha => {
  class RepositorioAlteraFalhaStub implements RepositorioAlteraFalha {
    async alterar (dados: FalhaAlterada): Promise<string> {
      return 'Falha alterada com sucesso'
    }
  }
  return new RepositorioAlteraFalhaStub()
}

interface SubTipos {
  sut: AlteraFalhaBD
  repositorioConsultaFalhaStub: RepositorioConsultaFalha
  validaEquipamentoStub: ValidadorBD
  repositorioAlteraFalhaStub: RepositorioAlteraFalha
}

const makeSut = (): SubTipos => {
  const repositorioAlteraFalhaStub = makeRepositorioAlteraFalhaStub()
  const validaEquipamentoStub = makeValidaEquipamentoStub()
  const repositorioConsultaFalhaStub = makeRepositorioConsultaFalhaStub()
  const sut = new AlteraFalhaBD(repositorioConsultaFalhaStub, validaEquipamentoStub, repositorioAlteraFalhaStub)
  return {
    sut,
    repositorioConsultaFalhaStub,
    validaEquipamentoStub,
    repositorioAlteraFalhaStub
  }
}

describe('AlteraFalhaBD', () => {
  test('Deve chamar o método consultar do RepositorioConsultaFalha com o parâmetro correto', async () => {
    const { sut, repositorioConsultaFalhaStub } = makeSut()
    const consultarSpy = jest.spyOn(repositorioConsultaFalhaStub, 'consultar')
    await sut.alterar(falhaAlterada)
    expect(consultarSpy).toHaveBeenCalledWith(falhaAlterada.id)
  })

  test('Deve retornar um erro caso o método consultar retorne um erro', async () => {
    const { sut, repositorioConsultaFalhaStub } = makeSut()
    jest.spyOn(repositorioConsultaFalhaStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.alterar(falhaAlterada)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar falhaInvalida: true e parametro: id caso o método consultar retorne null', async () => {
    const { sut, repositorioConsultaFalhaStub } = makeSut()
    jest.spyOn(repositorioConsultaFalhaStub, 'consultar').mockReturnValueOnce(Promise.resolve(null))
    const resposta = await sut.alterar(falhaAlterada)
    expect(resposta).toEqual({
      falhaInvalida: true,
      parametro: 'id'
    })
  })

  test('Deve chamar o validadorDeEquipamento com o parâmetro correto', async () => {
    const { sut, validaEquipamentoStub } = makeSut()
    const validarSpy = jest.spyOn(validaEquipamentoStub, 'validar')
    await sut.alterar(falhaAlterada)
    expect(validarSpy).toHaveBeenCalledWith(falhaAlterada.id)
  })

  test('Deve retornar um erro caso o validadorDeEquipamento retorne um erro', async () => {
    const { sut, validaEquipamentoStub } = makeSut()
    jest.spyOn(validaEquipamentoStub, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.alterar(falhaAlterada)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar falhaInvalida: true e parametro: equipamentoId caso o validadorDeEquipamento retorne false', async () => {
    const { sut, validaEquipamentoStub } = makeSut()
    jest.spyOn(validaEquipamentoStub, 'validar').mockReturnValueOnce(Promise.resolve(false))
    const resposta = await sut.alterar(falhaAlterada)
    expect(resposta).toEqual({
      falhaInvalida: true,
      parametro: 'equipamentoId'
    })
  })

  test('Deve chamar o RepositorioAlteraFalha com o parâmetro correto', async () => {
    const { sut, repositorioAlteraFalhaStub } = makeSut()
    const alterarSpy = jest.spyOn(repositorioAlteraFalhaStub, 'alterar')
    await sut.alterar(falhaAlterada)
    expect(alterarSpy).toHaveBeenCalledWith(falhaAlterada)
  })

  test('Deve retornar um erro caso o RepositorioAlteraFalha retorne um erro', async () => {
    const { sut, repositorioAlteraFalhaStub } = makeSut()
    jest.spyOn(repositorioAlteraFalhaStub, 'alterar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.alterar(falhaAlterada)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar falhaInvalida: false e parametro: Falha alterada com sucesso em caso de sucesso', async () => {
    const { sut } = makeSut()
    const resposta = await sut.alterar(falhaAlterada)
    expect(resposta).toEqual({
      falhaInvalida: false,
      parametro: 'Falha alterada com sucesso'
    })
  })
})
