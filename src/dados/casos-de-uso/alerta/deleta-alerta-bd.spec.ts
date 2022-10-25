import { DeletaAlertaBD } from './deleta-alerta-bd'
import { RepositorioAlteraAlertaAtivo } from '@/dados/protocolos/bd/alerta/repositorio-altera-alerta-ativo'
import { ValidadorBD } from '@/dados/protocolos/utilidades/validadorBD'

const makeRepositorioAlteraAlertaAtivoStub = (): RepositorioAlteraAlertaAtivo => {
  class RepositorioAlteraAlertaAtivoStub implements RepositorioAlteraAlertaAtivo {
    async alterarAtivo (ativo: boolean, id: number): Promise<null> {
      return null
    }
  }
  return new RepositorioAlteraAlertaAtivoStub()
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
  sut: DeletaAlertaBD
  validadorDeAlertaStub: ValidadorBD
  repositorioAlteraAlertaAtivoStub: RepositorioAlteraAlertaAtivo
}

const makeSut = (): SubTipos => {
  const repositorioAlteraAlertaAtivoStub = makeRepositorioAlteraAlertaAtivoStub()
  const validadorDeAlertaStub = makeValidadorDeAlertaStub()
  const sut = new DeletaAlertaBD(validadorDeAlertaStub, repositorioAlteraAlertaAtivoStub)
  return {
    sut,
    validadorDeAlertaStub,
    repositorioAlteraAlertaAtivoStub
  }
}

describe('DeletaAlertaBD', () => {
  test('Deve chamar o validaAlerta com o valor correto', async () => {
    const { sut, validadorDeAlertaStub } = makeSut()
    const validarSpy = jest.spyOn(validadorDeAlertaStub, 'validar')
    await sut.deletar(1)
    expect(validarSpy).toHaveBeenCalledWith(1)
  })

  test('Deve retornar um erro caso o validaAlerta retorne um erro', async () => {
    const { sut, validadorDeAlertaStub } = makeSut()
    jest.spyOn(validadorDeAlertaStub, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.deletar(1)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar null caso o validaAlerta retorne false', async () => {
    const { sut, validadorDeAlertaStub } = makeSut()
    jest.spyOn(validadorDeAlertaStub, 'validar').mockReturnValueOnce(Promise.resolve(false))
    const resposta = await sut.deletar(1)
    expect(resposta).toBeNull()
  })

  test('Deve chamar o repositorioAlteraAlertaAtivo com o valor correto', async () => {
    const { sut, repositorioAlteraAlertaAtivoStub } = makeSut()
    const alterarAtivoSpy = jest.spyOn(repositorioAlteraAlertaAtivoStub, 'alterarAtivo')
    await sut.deletar(1)
    expect(alterarAtivoSpy).toHaveBeenCalledWith(false, 1)
  })

  test('Deve retornar um erro caso o repositorioAlteraAlertaAtivo retorne um erro', async () => {
    const { sut, repositorioAlteraAlertaAtivoStub } = makeSut()
    jest.spyOn(repositorioAlteraAlertaAtivoStub, 'alterarAtivo').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.deletar(1)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar a mensagem "Alerta deletado com sucesso" em caso de sucesso', async () => {
    const { sut } = makeSut()
    const resposta = await sut.deletar(1)
    expect(resposta).toBe('Alerta deletado com sucesso')
  })
})
