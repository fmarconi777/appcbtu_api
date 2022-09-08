import { ConsultaAlertaBD } from './consulta-alerta-bd'
import { RepositorioConsultaAlerta, ModelosAlertas } from '../../protocolos/bd/alerta/repositorio-consulta-alerta-todas'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { RepositorioAlteraAlertaAtivo } from '../../protocolos/bd/alerta/repositorio-altera-alerta-ativo'
import { AuxiliarAlerta } from '../../protocolos/utilidades/auxiliar-alerta'

const makeAlertaFalsa = (): ModeloAlerta => ({
  id: '1',
  descricao: 'descricao_qualquer',
  prioridade: 'prioridade_qualquer',
  ativo: 'true',
  dataInicio: 'dataInicio_qualquer',
  dataFim: '2025-01-01T00:00:00.000Z',
  estacaoId: 'estacaoId_qualquer'
})

const makeRepositorioAlerta = (): RepositorioConsultaAlerta => {
  class RepositorioConsultaAlertaStub implements RepositorioConsultaAlerta {
    async consultar (sigla?: string, id?: number): Promise<ModelosAlertas> {
      if (sigla) { //eslint-disable-line
        if (id) { //eslint-disable-line
          return await new Promise(resolve => resolve(makeAlertaFalsa()))
        }
        return await new Promise(resolve => resolve([makeAlertaFalsa(), makeAlertaFalsa()]))
      }
      return await new Promise(resolve => resolve([makeAlertaFalsa(), makeAlertaFalsa()]))
    }
  }
  return new RepositorioConsultaAlertaStub()
}

const makeRepositorioAlteraAlertaAtivoStub = (): RepositorioAlteraAlertaAtivo => {
  class RepositorioAlteraAlertaAtivoStub implements RepositorioAlteraAlertaAtivo {
    async alterarAtivo (ativo: boolean, id: number): Promise<null> {
      return null
    }
  }
  return new RepositorioAlteraAlertaAtivoStub()
}

const makeAuxiliarAlertaStub = (): AuxiliarAlerta => {
  class AuxiliarAlertaStub implements AuxiliarAlerta {
    compararDatas (data: string): boolean {
      return false
    }

    async filtrarAlertas (vetor: any[], repositorioAlteraAlertaAtivo: RepositorioAlteraAlertaAtivo): Promise<any[]> {
      return await Promise.resolve([makeAlertaFalsa()])
    }
  }
  return new AuxiliarAlertaStub()
}

interface SubTipo {
  sut: ConsultaAlertaBD
  repositorioConsultaAlertaStub: RepositorioConsultaAlerta
  repositorioAlteraAlertaAtivoStub: RepositorioAlteraAlertaAtivo
  auxiliarAlertaStub: AuxiliarAlerta
}

const makeSut = (): SubTipo => {
  const auxiliarAlertaStub = makeAuxiliarAlertaStub()
  const repositorioAlteraAlertaAtivoStub = makeRepositorioAlteraAlertaAtivoStub()
  const repositorioConsultaAlertaStub = makeRepositorioAlerta()
  const sut = new ConsultaAlertaBD(repositorioConsultaAlertaStub,
    repositorioAlteraAlertaAtivoStub,
    auxiliarAlertaStub
  )
  return {
    sut,
    repositorioConsultaAlertaStub,
    repositorioAlteraAlertaAtivoStub,
    auxiliarAlertaStub
  }
}

describe('ConsultaAlerta', () => {
  describe('Método consultarTodas', () => {
    test('Método consultaAlertaTodas deve retornar um erro caso o RepositorioConsultaAlerta retorne um erro', async () => {
      const { sut, repositorioConsultaAlertaStub } = makeSut()
      jest.spyOn(repositorioConsultaAlertaStub, 'consultar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const respostaConsultar = sut.consultarTodas()
      await expect(respostaConsultar).rejects.toThrow()
    })

    test('Deve retornar um array vazio caso o RepositorioConsultaAlerta não encontre nunhum alerta', async () => {
      const { sut, repositorioConsultaAlertaStub } = makeSut()
      jest.spyOn(repositorioConsultaAlertaStub, 'consultar').mockReturnValueOnce(new Promise(resolve => resolve(null)))
      const respostaConsultar = await sut.consultarTodas()
      expect(respostaConsultar).toEqual([])
    })

    test('Deve chamar o filtrarAlertas com os valores corretos caso hajam alertas', async () => {
      const { sut, auxiliarAlertaStub, repositorioAlteraAlertaAtivoStub } = makeSut()
      const filtrarAlertasSpy = jest.spyOn(auxiliarAlertaStub, 'filtrarAlertas')
      await sut.consultarTodas()
      expect(filtrarAlertasSpy).toHaveBeenCalledWith([makeAlertaFalsa(), makeAlertaFalsa()], repositorioAlteraAlertaAtivoStub)
    })

    test('Deve retornar um erro caso o filtrarAlertas retorne um erro', async () => {
      const { sut, auxiliarAlertaStub } = makeSut()
      jest.spyOn(auxiliarAlertaStub, 'filtrarAlertas').mockReturnValueOnce(Promise.reject(new Error()))
      const resposta = sut.consultarTodas()
      await expect(resposta).rejects.toThrow()
    })

    test('Deve Retornar um array com todos os alertas ativos em caso de sucesso', async () => {
      const { sut } = makeSut()
      const resposta = await sut.consultarTodas()
      expect(resposta).toEqual([makeAlertaFalsa()])
    })
  })

  describe('Método consultar', () => {
    test('Deve chamar o RepositorioConsultaAlerta com o valor correto caso somente a sigla seja fornecida', async () => {
      const { sut, repositorioConsultaAlertaStub } = makeSut()
      const consultarSpy = jest.spyOn(repositorioConsultaAlertaStub, 'consultar')
      const sigla = 'sigla_qualquer'
      await sut.consultar(sigla)
      expect(consultarSpy).toHaveBeenCalledWith('sigla_qualquer')
    })

    test('Método consultaralerta deve retornar um erro caso o RepositorioConsultaAlerta retorne um erro', async () => {
      const { sut, repositorioConsultaAlertaStub } = makeSut()
      jest.spyOn(repositorioConsultaAlertaStub, 'consultar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const sigla = 'sigla_qualquer'
      const respostaConsultar = sut.consultar(sigla)
      await expect(respostaConsultar).rejects.toThrow()
    })

    test('Deve retornar um array vazio caso o RepositorioConsultaAlerta não encontre um alerta para a sigla', async () => {
      const { sut, repositorioConsultaAlertaStub } = makeSut()
      jest.spyOn(repositorioConsultaAlertaStub, 'consultar').mockReturnValueOnce(new Promise(resolve => resolve(null)))
      const sigla = 'sigla_qualquer'
      const respostaConsultar = await sut.consultar(sigla)
      expect(respostaConsultar).toEqual([])
    })

    test('Deve chamar o filtrarAlertas com os valores corretos caso hajam alertas', async () => {
      const { sut, auxiliarAlertaStub, repositorioAlteraAlertaAtivoStub } = makeSut()
      const filtrarAlertasSpy = jest.spyOn(auxiliarAlertaStub, 'filtrarAlertas')
      const sigla = 'sigla_qualquer'
      await sut.consultar(sigla)
      expect(filtrarAlertasSpy).toHaveBeenCalledWith([makeAlertaFalsa(), makeAlertaFalsa()], repositorioAlteraAlertaAtivoStub)
    })

    test('Deve retornar um erro caso o filtrarAlertas retorne um erro', async () => {
      const { sut, auxiliarAlertaStub } = makeSut()
      jest.spyOn(auxiliarAlertaStub, 'filtrarAlertas').mockReturnValueOnce(Promise.reject(new Error()))
      const sigla = 'sigla_qualquer'
      const resposta = sut.consultar(sigla)
      await expect(resposta).rejects.toThrow()
    })

    test('Deve retornar um array de alertas ativos em caso de sucesso quando somente a sigla seja fornecida', async () => {
      const { sut } = makeSut()
      const sigla = 'sigla_qualquer'
      const resposta = await sut.consultar(sigla)
      expect(resposta).toEqual([makeAlertaFalsa()])
    })

    test('Deve chamar o RepositorioConsultaAlerta com os valores corretos caso uma sigla e um id sejam fornecidos', async () => {
      const { sut, repositorioConsultaAlertaStub } = makeSut()
      const consultarSpy = jest.spyOn(repositorioConsultaAlertaStub, 'consultar')
      const sigla = 'sigla_qualquer'
      const id = '1'
      await sut.consultar(sigla, +id)
      expect(consultarSpy).toHaveBeenCalledWith(sigla, +id)
    })

    test('Deve retornar um erro caso o repositorioConsultaAlerta retorne um erro', async () => {
      const { sut, repositorioConsultaAlertaStub } = makeSut()
      jest.spyOn(repositorioConsultaAlertaStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
      const sigla = 'sigla_qualquer'
      const id = '1'
      const resposta = sut.consultar(sigla, +id)
      await expect(resposta).rejects.toThrow()
    })

    test('Deve retornar null caso o RepositorioConsultaAlerta retorne null', async () => {
      const { sut, repositorioConsultaAlertaStub } = makeSut()
      jest.spyOn(repositorioConsultaAlertaStub, 'consultar').mockReturnValueOnce(Promise.resolve(null))
      const sigla = 'sigla_qualquer'
      const id = '1'
      const resposta = await sut.consultar(sigla, +id)
      expect(resposta).toBeNull()
    })

    test('Deve chamar o compararDatas com o valor correto caso RepositorioConsultaAlerta retorne um alerta', async () => {
      const { sut, auxiliarAlertaStub } = makeSut()
      const compararDatasSpy = jest.spyOn(auxiliarAlertaStub, 'compararDatas')
      const sigla = 'sigla_qualquer'
      const id = '1'
      await sut.consultar(sigla, +id)
      expect(compararDatasSpy).toHaveBeenCalledWith('2025-01-01T00:00:00.000Z')
    })

    test('Deve retornar um erro caso o compararDatas retorne um erro', async () => {
      const { sut, auxiliarAlertaStub } = makeSut()
      jest.spyOn(auxiliarAlertaStub, 'compararDatas').mockImplementationOnce(() => { throw new Error() })
      const sigla = 'sigla_qualquer'
      const id = '1'
      const resposta = sut.consultar(sigla, +id)
      await expect(resposta).rejects.toThrow()
    })

    test('Deve chamar o RepositorioAlteraAlertaAtivo com os valores corretos caso a dataFim seja menor que a data atual', async () => {
      const { sut, repositorioAlteraAlertaAtivoStub, auxiliarAlertaStub } = makeSut()
      jest.spyOn(auxiliarAlertaStub, 'compararDatas').mockReturnValueOnce(true)
      const alterarAtivoSpy = jest.spyOn(repositorioAlteraAlertaAtivoStub, 'alterarAtivo')
      const sigla = 'sigla_qualquer'
      const id = '1'
      await sut.consultar(sigla, +id)
      expect(alterarAtivoSpy).toHaveBeenCalledWith(false, +id)
    })

    test('Deve retornar um erro caso o RepositorioAlteraAlertaAtivo retorne um erro', async () => {
      const { sut, repositorioAlteraAlertaAtivoStub, auxiliarAlertaStub } = makeSut()
      jest.spyOn(auxiliarAlertaStub, 'compararDatas').mockReturnValueOnce(true)
      jest.spyOn(repositorioAlteraAlertaAtivoStub, 'alterarAtivo').mockReturnValueOnce(Promise.reject(new Error()))
      const sigla = 'sigla_qualquer'
      const id = '1'
      const resposta = sut.consultar(sigla, +id)
      await expect(resposta).rejects.toThrow()
    })

    test('Deve retornar null caso a dataFim seja menor que a data atual', async () => {
      const { sut, auxiliarAlertaStub } = makeSut()
      jest.spyOn(auxiliarAlertaStub, 'compararDatas').mockReturnValueOnce(true)
      const sigla = 'sigla_qualquer'
      const id = '1'
      const resposta = await sut.consultar(sigla, +id)
      expect(resposta).toBeNull()
    })

    test('Deve retornar o alerta para a sigla e o id em caso de sucesso', async () => {
      const { sut } = makeSut()
      const sigla = 'sigla_qualquer'
      const id = '1'
      const resposta = await sut.consultar(sigla, +id)
      expect(resposta).toEqual(makeAlertaFalsa())
    })
  })
})
