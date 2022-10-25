import { ConsultaEquipamentoBD } from './consulta-equipamento-bd'
import { ModeloEquipamento } from '@/dominio/modelos/equipamento'
import { RepositorioConsultaEquipamento } from '@/dados/protocolos/bd/equipamento/repositorio-consulta-equipamento'

const dadosFalsos = {
  id: 'id_qualquer',
  nome: 'nome_qualquer',
  tipo: 'tipo_qualquer',
  estado: 'estado_qualquer',
  estacaoId: 'estacaoId_qualquer'
}

const makeRepositorioConsultaEquipamento = (): RepositorioConsultaEquipamento => {
  class RepositorioConsultaEquipamentoStub implements RepositorioConsultaEquipamento {
    async consultar (id?: number): Promise<ModeloEquipamento | ModeloEquipamento[] | null> {
      if (id) { // eslint-disable-line
        return await new Promise(resolve => resolve(dadosFalsos))
      }
      return await new Promise(resolve => resolve([dadosFalsos]))
    }
  }
  return new RepositorioConsultaEquipamentoStub()
}

interface SubTipos {
  sut: ConsultaEquipamentoBD
  repositorioConsultaEquipamentoStub: RepositorioConsultaEquipamento
}

const makeSut = (): SubTipos => {
  const repositorioConsultaEquipamentoStub = makeRepositorioConsultaEquipamento()
  const sut = new ConsultaEquipamentoBD(repositorioConsultaEquipamentoStub)
  return {
    sut,
    repositorioConsultaEquipamentoStub
  }
}

describe('ConsultaEquipamentoBD', () => {
  test('Deve retornar um array com todos os equipamentos caso um parametro não seja fornecido', async () => {
    const { sut } = makeSut()
    const resposta = await sut.consultarTodos()
    expect(resposta).toEqual([dadosFalsos])
  })

  test('Deve retornar um erro caso RepositorioConsultaEquipamento retorne um erro no método consultarTodos', async () => {
    const { sut, repositorioConsultaEquipamentoStub } = makeSut()
    jest.spyOn(repositorioConsultaEquipamentoStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.consultarTodos()
    await expect(resposta).rejects.toThrow()
  })

  test('Deve chamar o repositorioConsultaEquipamento com o valor correto no método consultar', async () => {
    const { sut, repositorioConsultaEquipamentoStub } = makeSut()
    const consultarSpy = jest.spyOn(repositorioConsultaEquipamentoStub, 'consultar')
    await sut.consultar(1)
    expect(consultarSpy).toHaveBeenCalledWith(1)
  })

  test('Deve retornar um equipamento caso um parametro seja fornecido', async () => {
    const { sut } = makeSut()
    const resposta = await sut.consultar(1)
    expect(resposta).toEqual(dadosFalsos)
  })

  test('Deve retornar null caso um parametro não cadastrado seja fornecido', async () => {
    const { sut, repositorioConsultaEquipamentoStub } = makeSut()
    jest.spyOn(repositorioConsultaEquipamentoStub, 'consultar').mockReturnValueOnce(Promise.resolve(null))
    const resposta = await sut.consultar(1)
    expect(resposta).toBeNull()
  })

  test('Deve retornar um erro caso RepositorioConsultaEquipamento retorne um erro no método consultar', async () => {
    const { sut, repositorioConsultaEquipamentoStub } = makeSut()
    jest.spyOn(repositorioConsultaEquipamentoStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.consultar(1)
    await expect(resposta).rejects.toThrow()
  })
})
