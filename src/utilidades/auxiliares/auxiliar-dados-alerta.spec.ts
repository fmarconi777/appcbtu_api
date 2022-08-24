import { RepositorioAlteraAlertaAtivo } from '../../dados/protocolos/bd/alerta/repositorio-altera-alerta-ativo'
import { AuxiliarAlerta } from './auxiliar-dados-alerta'

const makeRepositorioAlteraAlertaAtivoStub = (): RepositorioAlteraAlertaAtivo => {
  class RepositorioAlteraAlertaAtivoStub implements RepositorioAlteraAlertaAtivo {
    async alterarAtivo (ativo: boolean, id: number): Promise<null> {
      return await Promise.resolve(null)
    }
  }
  return new RepositorioAlteraAlertaAtivoStub()
}

interface SubTipos {
  sut: AuxiliarAlerta
  repositorioAlteraAlertaAtivoStub: RepositorioAlteraAlertaAtivo
}

const makeSut = (): SubTipos => {
  const repositorioAlteraAlertaAtivoStub = makeRepositorioAlteraAlertaAtivoStub()
  const sut = new AuxiliarAlerta(repositorioAlteraAlertaAtivoStub)
  return {
    sut,
    repositorioAlteraAlertaAtivoStub
  }
}

describe('Auxiliar Alerta', () => {
  describe('Método compararDatas', () => {
    test('Deve retornar true caso a data recebida seja menor que a data atual', () => {
      const { sut } = makeSut()
      const data = new Date('01/01/2022').toString()
      const resposta = sut.compararDatas(data)
      expect(resposta).toBeTruthy()
    })

    test('Deve retornar false caso a data recebida seja maior que a data atual', () => {
      const { sut } = makeSut()
      const data = new Date('12/31/2022').toString()
      const resposta = sut.compararDatas(data)
      expect(resposta).toBeFalsy()
    })
  })

  describe('Método condicional', () => {
    test('Deve chamar o compararDatas com o valor correto', async () => {
      const { sut } = makeSut()
      const compararDatasSpy = jest.spyOn(sut, 'compararDatas')
      const alerta = { dataFim: new Date('12/31/2022').toString(), id: '1' }
      await sut.condicional(alerta)
      expect(compararDatasSpy).toHaveBeenCalledWith(alerta.dataFim)
    })

    test('Deve retornar true caso o compararDatas retorne false', async () => {
      const { sut } = makeSut()
      const alerta = { dataFim: new Date('12/31/2022').toString(), id: '1' }
      const resposta = await sut.condicional(alerta)
      expect(resposta).toBeTruthy()
    })

    test('Deve chamar o repositorioAlteraAlertaAtivo com os valores corretos caso o compararDatas retorne true', async () => {
      const { sut, repositorioAlteraAlertaAtivoStub } = makeSut()
      const alterarAtivoSpy = jest.spyOn(repositorioAlteraAlertaAtivoStub, 'alterarAtivo')
      const alerta = { dataFim: new Date('01/01/2022').toString(), id: '1' }
      await sut.condicional(alerta)
      expect(alterarAtivoSpy).toHaveBeenCalledWith(false, +alerta.id)
    })

    test('Deve retornar false caso o compararDatas retorne true', async () => {
      const { sut } = makeSut()
      const alerta = { dataFim: new Date('01/01/2022').toString(), id: '1' }
      const resposta = await sut.condicional(alerta)
      expect(resposta).toBeFalsy()
    })
  })

  describe('Método asyncFilter', () => {
    test('Deve retornar um array caso o condicional retorne true', async () => {
      const { sut } = makeSut()
      const array = [1, 2, 3, 4, 5]
      const condicional = async (): Promise<boolean> => (await Promise.resolve(true))
      const resposta = await sut.asyncFilter(array, condicional)
      expect(resposta).toEqual(array)
    })

    test('Deve retornar um array vazio caso  o condicional retorne false', async () => {
      const { sut } = makeSut()
      const array = [1, 2, 3, 4, 5]
      const condicional = async (): Promise<boolean> => (await Promise.resolve(false))
      const resposta = await sut.asyncFilter(array, condicional)
      expect(resposta).toEqual([])
    })
  })
})
