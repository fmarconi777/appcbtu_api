import { ModeloFalha } from '../../../dominio/modelos/falha'
import { RepositorioConsultaFalha } from '../../protocolos/bd/falha/repositorio-consulta-falha'
import { ConsultaFalhaBD } from './consulta-falha-bd'

const falhaFalsa = {
  id: '1',
  numFalha: 'numero_qualquer',
  dataCriacao: '2022-01-01T00:00:00Z',
  equipamentoId: '1'
}

const makeRepositorioConsultaFalhaStub = (): RepositorioConsultaFalha => {
  class RepositorioConsultaFalhaStub implements RepositorioConsultaFalha {
    async consultar (id?: number): Promise<ModeloFalha | ModeloFalha[] | null> {
      if (id) { // eslint-disable-line
        return await Promise.resolve(falhaFalsa)
      }
      return await Promise.resolve([falhaFalsa])
    }
  }
  return new RepositorioConsultaFalhaStub()
}

interface SubTipos {
  sut: ConsultaFalhaBD
  repositorioConsultaFalhaStub: RepositorioConsultaFalha
}

const makeSut = (): SubTipos => {
  const repositorioConsultaFalhaStub = makeRepositorioConsultaFalhaStub()
  const sut = new ConsultaFalhaBD(repositorioConsultaFalhaStub)
  return {
    sut,
    repositorioConsultaFalhaStub
  }
}

describe('ConsultaFalhaBD', () => {
  describe('Método consultarTodas', () => {
    test('Deve retornar um array com todas as falhas', async () => {
      const { sut } = makeSut()
      const resposta = await sut.consultarTodas()
      expect(resposta).toEqual([falhaFalsa])
    })

    test('Deve retornar um erro caso o repositorioConsultaFalha retorne um erro', async () => {
      const { sut, repositorioConsultaFalhaStub } = makeSut()
      jest.spyOn(repositorioConsultaFalhaStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
      const resposta = sut.consultarTodas()
      await expect(resposta).rejects.toThrow()
    })
  })

  describe('Método consultar', () => {
    test('Deve chamar o repositorioConsultaFalha com o valor correto', async () => {
      const { sut, repositorioConsultaFalhaStub } = makeSut()
      const consultarSpy = jest.spyOn(repositorioConsultaFalhaStub, 'consultar')
      await sut.consultar(1)
      expect(consultarSpy).toHaveBeenCalledWith(1)
    })

    test('Deve retornar um erro caso o repositorioConsultaFalha retorne um erro', async () => {
      const { sut, repositorioConsultaFalhaStub } = makeSut()
      jest.spyOn(repositorioConsultaFalhaStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
      const resposta = sut.consultar(1)
      await expect(resposta).rejects.toThrow()
    })

    test('Deve retornar null caso o repositorioConsultaFalha retorne null', async () => {
      const { sut, repositorioConsultaFalhaStub } = makeSut()
      jest.spyOn(repositorioConsultaFalhaStub, 'consultar').mockReturnValueOnce(Promise.resolve(null))
      const resposta = await sut.consultar(1)
      expect(resposta).toBeNull()
    })
  })
})
