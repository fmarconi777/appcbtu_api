import { Validador } from '../protocolos/validador'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ErroDeServidor } from '../erros/erro-de-servidor'
import { erroDeServidor, requisicaoImpropria } from '../auxiliares/auxiliar-http'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ControladorDeArea } from './area'
import { ConsultaArea } from '../../dominio/casos-de-uso/area/consulta-area'
import { ModeloArea } from '../../dominio/modelos/area'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroArea } from '../../dominio/casos-de-uso/area/cadastro-de-area'

describe('Controlador de estações', () => {
  const makeConsultaArea = (): ConsultaArea => {
    class ConsultaAreaStub implements ConsultaArea {
      async consultarTodas (): Promise<ModeloArea[]> {
        const listaFalsa = [{
          id: 'id_qualquer',
          nome: 'nome_qualquer'
        }]
        return await new Promise(resolve => resolve(listaFalsa))
      }

      async consultar (parametro: string): Promise<ModeloArea> {
        const areaFalsa = {
          id: 'id_valida',
          nome: parametro
        }
        return await new Promise(resolve => resolve(areaFalsa))
      }
    }
    return new ConsultaAreaStub()
  }

  const makeValidaArea = (): Validador => {
    class ValidaAreaStub implements Validador {
      validar (parametro: string): boolean {
        return true
      }
    }
    return new ValidaAreaStub()
  }

  const makeCadastroDeArea = (): CadastroArea => {
    class CadastroDeAreaStub implements CadastroArea {
      async inserir (nome: string): Promise<ModeloArea> {
        return await new Promise(resolve => resolve({
          id: 'id_qualquer',
          nome
        }))
      }
    }
    return new CadastroDeAreaStub()
  }

  interface SutTypes {
    sut: ControladorDeArea
    consultaAreaStub: ConsultaArea
    validaAreaStub: Validador
    cadastroDeAreaStub: CadastroArea
  }

  const makeSut = (): SutTypes => {
    const cadastroDeAreaStub = makeCadastroDeArea()
    const consultaAreaStub = makeConsultaArea()
    const validaAreaStub = makeValidaArea()
    const sut = new ControladorDeArea(consultaAreaStub, validaAreaStub, cadastroDeAreaStub)
    return {
      sut,
      consultaAreaStub,
      validaAreaStub,
      cadastroDeAreaStub
    }
  }

  test('Deve retornar status 400 se um método não suportado for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = { parametro: 'area_qualquer', metodo: 'metodo_invalido' }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroMetodoInvalido())
  })

  describe('Método GET', () => {
    test('Deve retornar codigo 200 e todas as áreas se um parâmetro não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = { corpo: '', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(200)
      expect(respostaHttp.corpo).toEqual([{
        id: 'id_qualquer',
        nome: 'nome_qualquer'
      }])
    })

    test('Deve chamar ConsultaEstacao com o valor correto', async () => {
      const { sut, consultaAreaStub } = makeSut()
      const spyConsula = jest.spyOn(consultaAreaStub, 'consultar')
      const requisicaoHttp = { parametro: 'area_qualquer', metodo: 'GET' }
      await sut.tratar(requisicaoHttp)
      expect(spyConsula).toHaveBeenCalledWith('area_qualquer')
    })

    test('Deve retornar codigo 200 e uma área se o parâmetro estiver correto', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = { parametro: 'area_valida', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(200)
      expect(respostaHttp.corpo).toEqual({
        id: 'id_valida',
        nome: 'area_valida'
      })
    })

    test('Deve chamar ValidaArea com o valor correto', async () => {
      const { sut, validaAreaStub } = makeSut()
      const spyConsula = jest.spyOn(validaAreaStub, 'validar')
      const requisicaoHttp = { parametro: 'area_qualquer', metodo: 'GET' }
      await sut.tratar(requisicaoHttp)
      expect(spyConsula).toHaveBeenCalledWith('AREA_QUALQUER')
    })

    test('Deve retornar codigo 400 se o parâmetro estiver incorreto', async () => {
      const { sut, validaAreaStub } = makeSut()
      jest.spyOn(validaAreaStub, 'validar').mockReturnValueOnce(false)
      const requisicaoHttp = { parametro: 'area_invalida', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(404)
      expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('área'))
    })

    test('Deve retornar codigo 500 se o ConsultaArea retornar um erro', async () => {
      const { sut, consultaAreaStub } = makeSut()
      const erroFalso = new Error()
      erroFalso.stack = 'stack_qualquer'
      const erro = erroDeServidor(erroFalso)
      jest.spyOn(consultaAreaStub, 'consultarTodas').mockImplementationOnce(async () => {
        return await new Promise((resolve, reject) => reject(erro))
      })
      jest.spyOn(consultaAreaStub, 'consultar').mockImplementationOnce(async () => {
        return await new Promise((resolve, reject) => reject(erro))
      })
      const requisicaoHttpSemArea = { parametro: '', metodo: 'GET' }
      const requisicaoHttpComArea = { parametro: 'area_qualquer', metodo: 'GET' }
      const respostaHttpSemArea = await sut.tratar(requisicaoHttpSemArea)
      const respostaHttpComArea = await sut.tratar(requisicaoHttpComArea)
      expect(respostaHttpSemArea.status).toBe(500)
      expect(respostaHttpSemArea.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
      expect(respostaHttpComArea.status).toBe(500)
      expect(respostaHttpComArea.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
    })
  })

  describe('Método POST', () => {
    test('Deve retornar status 400 caso o nome da área for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          nome: ''
        },
        metodo: 'POST'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta).toEqual(requisicaoImpropria(new ErroFaltaParametro('nome')))
    })

    test('Deve chamar o cadastroDeArea com o valor correto', async () => {
      const { sut, cadastroDeAreaStub } = makeSut()
      const inserirSpy = jest.spyOn(cadastroDeAreaStub, 'inserir')
      const requisicaoHttp = {
        corpo: {
          nome: 'area_qualquer'
        },
        metodo: 'POST'
      }
      await sut.tratar(requisicaoHttp)
      expect(inserirSpy).toHaveBeenCalledWith('AREA_QUALQUER')
    })

    test('Deve retornar status 500 se o cadastroDeArea retornar um erro', async () => {
      const { sut, cadastroDeAreaStub } = makeSut()
      jest.spyOn(cadastroDeAreaStub, 'inserir').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const requisicaoHttp = {
        corpo: {
          nome: 'area_qualquer'
        },
        metodo: 'POST'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar status 200 se dadso válidos forem fornecidos', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          nome: 'area_qualquer'
        },
        metodo: 'POST'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta.status).toEqual(200)
      expect(resposta.corpo).toEqual({
        id: 'id_qualquer',
        nome: 'AREA_QUALQUER'
      })
    })
  })
})
