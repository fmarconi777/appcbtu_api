import { ValidadorDeEquipamento } from './validador-de-equipamento'
import { ConsultaEquipamento } from '@/dominio/casos-de-uso/equipamento/consulta-equipamento'
import { ModeloEquipamento } from '@/dominio/modelos/equipamento'
import { ValidadorBD } from '@/dados/protocolos/utilidades/validadorBD'

const dadosFalsos = {
  id: '1',
  nome: 'nome_qualquer',
  tipo: 'tipo_qualquer',
  estado: 'estado_qualquer',
  estacaoId: 'estacaoId_qualquer'
}

const makeConsultaEquipamentoStub = (): ConsultaEquipamento => {
  class ConsultaEquipamentoStub implements ConsultaEquipamento {
    async consultarTodos (): Promise<ModeloEquipamento[]> {
      return await new Promise(resolve => resolve([dadosFalsos]))
    }

    async consultar (id: number): Promise<ModeloEquipamento | null> {
      return await new Promise(resolve => resolve(dadosFalsos))
    }
  }
  return new ConsultaEquipamentoStub()
}

interface SubTipos {
  sut: ValidadorBD
  consultaEquipamentoStub: ConsultaEquipamento
}

const makeSut = (): SubTipos => {
  const consultaEquipamentoStub = makeConsultaEquipamentoStub()
  const sut = new ValidadorDeEquipamento(consultaEquipamentoStub)
  return {
    sut,
    consultaEquipamentoStub
  }
}

describe('Validador de parametro', () => {
  test('Deve retornar false se o validador retornar falso', async () => {
    const { sut } = makeSut()
    const eValido = await sut.validar('id_invalida')
    expect(eValido).toBe(false)
  })

  test('Deve retornar true se o validador retornar true', async () => {
    const { sut } = makeSut()
    const eValido = await sut.validar(1)
    expect(eValido).toBe(true)
  })

  test('Deve retornar um erro caso o ConsultaEquipamento retorne um erro', async () => {
    const { sut, consultaEquipamentoStub } = makeSut()
    jest.spyOn(consultaEquipamentoStub, 'consultarTodos').mockImplementationOnce(async () => await Promise.reject(new Error()))
    const resposta = sut.validar('id_qualquer')
    await expect(resposta).rejects.toThrow()
  })
})
