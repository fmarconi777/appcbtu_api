import { ConsultaAdministrador } from '../../dominio/casos-de-uso/middleware/consulta-administrador'
import { MiddlewareDeAdministrador } from './middleware-de-administrador'

const makeConsultaAdministradorStub = (): ConsultaAdministrador => {
  class ConsultaAdministradorStub implements ConsultaAdministrador {
    async consultar (): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new ConsultaAdministradorStub()
}

interface SubTipos {
  sut: MiddlewareDeAdministrador
  consultaAdministradorStub: ConsultaAdministrador
}

const makeSut = (): SubTipos => {
  const consultaAdministradorStub = makeConsultaAdministradorStub()
  const sut = new MiddlewareDeAdministrador(consultaAdministradorStub)
  return {
    sut,
    consultaAdministradorStub
  }
}

describe('Middleware de criação de conta de administrador', () => {
  test('Deve retornar um erro caso o consultaAdministrador retorne um erro', async () => {
    const { sut, consultaAdministradorStub } = makeSut()
    const consultarSpy = jest.spyOn(consultaAdministradorStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = await sut.tratarInput()
    expect(resposta).toBeUndefined()
    expect(consultarSpy).toHaveBeenCalled()
  })
})
