import { ValidadorBD } from '../../dados/protocolos/utilidades/validadorBD'
import { ValidadorDeAlerta } from './validador-de-alerta'
import { ConsultaAlerta } from '../../dominio/casos-de-uso/alerta/consulta-alerta'
import { ModeloAlerta } from '../../dominio/modelos/alerta'

const makeConsultaAlerta = (): ConsultaAlerta => {
  class ConsultaAlertaStub implements ConsultaAlerta {
    async consultar (): Promise<ModeloAlerta> {
      const listaFalsa = {
        id: '1',
        descricao: 'descricao_valida',
        prioridade: 'prioridade_valida',
        dataInicio: 'datainicio_valida',
        dataFim: 'datafim_valida',
        ativo: 'ativo_valida',
        estacaoId: 'estacaoid_valida'
      }
      return await new Promise(resolve => resolve(listaFalsa))
    }

    async consultarTodas (): Promise<ModeloAlerta[]> {
      const alertaFalsa = [{
        id: '1',
        descricao: 'descricao_qualquer',
        prioridade: 'prioridade_qualquer',
        dataInicio: 'datainicio_qualquer',
        dataFim: 'datafim_qualquer',
        ativo: 'ativo_qualquer',
        estacaoId: 'estacaoid_qualquer'
      }]
      return await new Promise(resolve => resolve(alertaFalsa))
    }
  }
  return new ConsultaAlertaStub()
}
interface Subtype {
  sut: ValidadorBD
  consultaAlertaStub: ConsultaAlerta
}
const makeSut = (): Subtype => {
  const consultaAlertaStub = makeConsultaAlerta()
  const sut = new ValidadorDeAlerta(consultaAlertaStub)
  return {
    sut,
    consultaAlertaStub
  }
}

describe('Validador de parametro', () => {
  test('Deve retornar false se o validador retornar falso', async () => {
    const { sut } = makeSut()
    const eValido = await sut.validar('alerta_invalido')
    expect(eValido).toBe(false)
  })

  test('Deve retornar um erro caso o consultaAlerta retorne um erro', async () => {
    const { sut, consultaAlertaStub } = makeSut()
    jest.spyOn(consultaAlertaStub, 'consultarTodas').mockImplementationOnce(async () => await Promise.reject(new Error()))
    const resposta = sut.validar('alerta_qualquer')
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar true se o validador retornar true', async () => {
    const { sut } = makeSut()
    const eValido = await sut.validar(1)
    expect(eValido).toBe(true)
  })
})
