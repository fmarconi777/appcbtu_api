import { RepositorioAlteraAlertaAtivo } from '../../dados/protocolos/bd/alerta/repositorio-altera-alerta-ativo'
import { AuxiliarDadosAlerta } from './auxiliar-dados-alerta'

const makeRepositorioAlteraAlertaAtivoStub = (): RepositorioAlteraAlertaAtivo => {
  class RepositorioAlteraAlertaAtivoStub implements RepositorioAlteraAlertaAtivo {
    async alterarAtivo (ativo: boolean, id: number): Promise<null> {
      return await Promise.resolve(null)
    }
  }
  return new RepositorioAlteraAlertaAtivoStub()
}

interface SubTipos {
  sut: AuxiliarDadosAlerta
  repositorioAlteraAlertaAtivoStub: RepositorioAlteraAlertaAtivo
}

const makeSut = (): SubTipos => {
  const repositorioAlteraAlertaAtivoStub = makeRepositorioAlteraAlertaAtivoStub()
  const sut = new AuxiliarDadosAlerta()
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

  describe('Método filtrarAlertas', () => {
    test('Deve chamar o compararDatas com o valor correto', async () => {
      const { sut, repositorioAlteraAlertaAtivoStub } = makeSut()
      const compararDatasSpy = jest.spyOn(sut, 'compararDatas')
      const alertas: any = [{
        id: '1',
        descricao: 'descricao_qualquer',
        prioridade: 'prioridade_qualquer',
        ativo: 'true',
        dataInicio: 'dataInicio_qualquer',
        dataFim: '2022-01-01T00:00:00.000Z',
        estacaoId: 'estacaoId_qualquer'
      }]
      await sut.filtrarAlertas(alertas, repositorioAlteraAlertaAtivoStub)
      expect(compararDatasSpy).toHaveBeenCalledWith(alertas[0].dataFim)
    })

    test('Deve retornar um erro caso o compararDatas retorne um erro', async () => {
      const { sut, repositorioAlteraAlertaAtivoStub } = makeSut()
      jest.spyOn(sut, 'compararDatas').mockImplementationOnce(() => { throw new Error() })
      const alertas: any = [{
        id: '1',
        descricao: 'descricao_qualquer',
        prioridade: 'prioridade_qualquer',
        ativo: 'true',
        dataInicio: 'dataInicio_qualquer',
        dataFim: '2022-01-01T00:00:00.000Z',
        estacaoId: 'estacaoId_qualquer'
      }]
      const resposta = sut.filtrarAlertas(alertas, repositorioAlteraAlertaAtivoStub)
      await expect(resposta).rejects.toThrow()
    })

    test('Deve chamar o repositorioAlteraAlertaAtivo com os valores corretos caso o compararDatas retorne true', async () => {
      const { sut, repositorioAlteraAlertaAtivoStub } = makeSut()
      const alterarAtivoSpy = jest.spyOn(repositorioAlteraAlertaAtivoStub, 'alterarAtivo')
      const alertas: any = [{
        id: '1',
        descricao: 'descricao_qualquer',
        prioridade: 'prioridade_qualquer',
        ativo: 'true',
        dataInicio: 'dataInicio_qualquer',
        dataFim: '2022-01-01T00:00:00.000Z',
        estacaoId: 'estacaoId_qualquer'
      }]
      await sut.filtrarAlertas(alertas, repositorioAlteraAlertaAtivoStub)
      expect(alterarAtivoSpy).toHaveBeenCalledWith(false, +alertas[0].id)
    })

    test('Deve retornar um erro caso o repositorioAlteraAlertaAtivo retorne um erro', async () => {
      const { sut, repositorioAlteraAlertaAtivoStub } = makeSut()
      jest.spyOn(repositorioAlteraAlertaAtivoStub, 'alterarAtivo').mockReturnValueOnce(Promise.reject(new Error()))
      const alertas: any = [{
        id: '1',
        descricao: 'descricao_qualquer',
        prioridade: 'prioridade_qualquer',
        ativo: 'true',
        dataInicio: 'dataInicio_qualquer',
        dataFim: '2022-01-01T00:00:00.000Z',
        estacaoId: 'estacaoId_qualquer'
      }]
      const resposta = sut.filtrarAlertas(alertas, repositorioAlteraAlertaAtivoStub)
      await expect(resposta).rejects.toThrow()
    })

    test('Deve retornar um array caso o compararDatas retorne false', async () => {
      const { sut, repositorioAlteraAlertaAtivoStub } = makeSut()
      const alertas: any = [{
        id: '1',
        descricao: 'descricao_qualquer',
        prioridade: 'prioridade_qualquer',
        ativo: 'true',
        dataInicio: 'dataInicio_qualquer',
        dataFim: '2025-10-01T00:00:00.000Z',
        estacaoId: 'estacaoId_qualquer'
      }]
      const resposta = await sut.filtrarAlertas(alertas, repositorioAlteraAlertaAtivoStub)
      expect(resposta).toEqual(alertas)
    })
  })
})
