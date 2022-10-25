import { AlteraAreaBD } from './altera-area-bd'
import { ModeloArea } from '@/dominio/modelos/area'
import { ConsultaAreaPorNome } from '@/dados/protocolos/bd/area/repositorio-consulta-area-por-nome'
import { RepositorioAlteraArea } from '@/dados/protocolos/bd/area/repositorio-altera-area'
import { ValidadorBD } from '@/dados/protocolos/utilidades/validadorBD'

const makeConsultaAreaPorNome = (): ConsultaAreaPorNome => {
  class ConsultaAreaPorNomeStub implements ConsultaAreaPorNome {
    async consultarPorNome (nome: string): Promise<ModeloArea | null> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new ConsultaAreaPorNomeStub()
}

const makeRepositorioAlteraAreaStub = (): RepositorioAlteraArea => {
  class RepositorioAlteraAreaStub implements RepositorioAlteraArea {
    async alterar (nome: string): Promise<string> {
      return await new Promise(resolve => resolve('Área alterada com sucesso'))
    }
  }
  return new RepositorioAlteraAreaStub()
}

const makeValidaAreaStub = (): ValidadorBD => {
  class ValidaAreaStub implements ValidadorBD {
    async validar (parametro: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new ValidaAreaStub()
}

interface SubTipos {
  sut: AlteraAreaBD
  validaAreaStub: ValidadorBD
  consultaAreaPorNomeStub: ConsultaAreaPorNome
  repositorioAlteraAreaStub: RepositorioAlteraArea
}

const makeSut = (): SubTipos => {
  const repositorioAlteraAreaStub = makeRepositorioAlteraAreaStub()
  const consultaAreaPorNomeStub = makeConsultaAreaPorNome()
  const validaAreaStub = makeValidaAreaStub()
  const sut = new AlteraAreaBD(validaAreaStub, consultaAreaPorNomeStub, repositorioAlteraAreaStub)
  return {
    sut,
    validaAreaStub,
    consultaAreaPorNomeStub,
    repositorioAlteraAreaStub
  }
}

describe('AlteraAreaBD', () => {
  test('Deve chamar o validaArea com o valor correto', async () => {
    const { sut, validaAreaStub } = makeSut()
    const validarSpy = jest.spyOn(validaAreaStub, 'validar')
    await sut.alterar('AREA_ALTERADA', 'AREA_QUALQUER')
    expect(validarSpy).toHaveBeenCalledWith('AREA_QUALQUER')
  })

  test('Deve retornar um erro caso o validaArea retorne um erro', async () => {
    const { sut, validaAreaStub } = makeSut()
    jest.spyOn(validaAreaStub, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.alterar('AREA_ALTERADA', 'AREA_QUALQUER')
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar null caso o validaArea retorne false', async () => {
    const { sut, validaAreaStub } = makeSut()
    jest.spyOn(validaAreaStub, 'validar').mockReturnValueOnce(Promise.resolve(false))
    const resposta = await sut.alterar('AREA_ALTERADA', 'AREA_QUALQUER')
    expect(resposta).toBeNull()
  })
  test('Deve chamar o consultaAreaPorNome com o valor correto', async () => {
    const { sut, consultaAreaPorNomeStub } = makeSut()
    const consultarPorNomeSpy = jest.spyOn(consultaAreaPorNomeStub, 'consultarPorNome')
    await sut.alterar('AREA_ALTERADA', 'AREA_QUALQUER')
    expect(consultarPorNomeSpy).toHaveBeenCalledWith('AREA_ALTERADA')
  })

  test('Deve retornar a mensagem "área já cadastrada" caso a área já exista no banco de dados', async () => {
    const { sut, consultaAreaPorNomeStub } = makeSut()
    jest.spyOn(consultaAreaPorNomeStub, 'consultarPorNome').mockReturnValueOnce(new Promise(resolve => resolve({ id: 'id_qualquer', nome: 'AREA_QUALQUER' })))
    const resposta = await sut.alterar('AREA_ALTERADA', 'AREA_QUALQUER')
    expect(resposta).toEqual('área já cadastrada')
  })

  test('Deve retornar um erro caso consultaAreaPorNome retorne um erro', async () => {
    const { sut, consultaAreaPorNomeStub } = makeSut()
    jest.spyOn(consultaAreaPorNomeStub, 'consultarPorNome').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const resposta = sut.alterar('AREA_ALTERADA', 'AREA_QUALQUER')
    await expect(resposta).rejects.toThrow()
  })

  test('Deve chamar o RepositorioAlteraArea com o valor correto', async () => {
    const { sut, repositorioAlteraAreaStub } = makeSut()
    const alterarSpy = jest.spyOn(repositorioAlteraAreaStub, 'alterar')
    await sut.alterar('AREA_ALTERADA', 'AREA_QUALQUER')
    expect(alterarSpy).toHaveBeenCalledWith('AREA_ALTERADA', 'AREA_QUALQUER')
  })

  test('Deve retornar um erro caso RepositorioAlteraArea retorne um erro', async () => {
    const { sut, repositorioAlteraAreaStub } = makeSut()
    jest.spyOn(repositorioAlteraAreaStub, 'alterar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const resposta = sut.alterar('AREA_ALTERADA', 'AREA_QUALQUER')
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar a mensagem "Área alterada com sucesso" em caso de sucesso', async () => {
    const { sut } = makeSut()
    const resposta = await sut.alterar('AREA_ALTERADA', 'AREA_QUALQUER')
    expect(resposta).toEqual('Área alterada com sucesso')
  })
})
