import { CadastroDeTelefone } from '../../dominio/casos-de-uso/telefone/cadastro-de-telefone'
import { erroDeServidor, requisicaoImpropria } from '../auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ControladorDeTelefone } from './telefone'

const dadoFalso = {
  numero: '3132505555',
  estacaoId: '1'
}

const makeCadastroDeTelefoneStub = (): CadastroDeTelefone => {
  class CadastroDeTelefoneStub implements CadastroDeTelefone {
    async inserir (numero: number, estacaoId: number): Promise<string | null> {
      return await Promise.resolve('Telefone cadastrado com sucesso')
    }
  }
  return new CadastroDeTelefoneStub()
}

interface SubTipos {
  sut: ControladorDeTelefone
  cadastroDeTelefoneStub: CadastroDeTelefone
}

const makeSut = (): SubTipos => {
  const cadastroDeTelefoneStub = makeCadastroDeTelefoneStub()
  const sut = new ControladorDeTelefone(cadastroDeTelefoneStub)
  return {
    sut,
    cadastroDeTelefoneStub
  }
}

describe('Controlador de telefone', () => {
  test('Deve retornar codigo 400 se um método não suportado for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      metodo: 'metodo_invalido'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroMetodoInvalido())
  })

  describe('Método POST', () => {
    test('Deve retornar status 400 caso o parametro numero não seja fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          estacaoId: '1'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoImpropria(new ErroFaltaParametro('numero')))
    })

    test('Deve retornar status 400 caso o parametro estacaoId não seja fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          numero: '3132505555'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoImpropria(new ErroFaltaParametro('estacaoId')))
    })

    test('Deve retornar status 400 caso o parametro numero seja inválido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          numero: 'NaN',
          estacaoId: '1'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoImpropria(new ErroParametroInvalido('numero')))
    })

    test('Deve chamar o cadastroDeTelefone com os parametros corretos', async () => {
      const { sut, cadastroDeTelefoneStub } = makeSut()
      const inserirSpy = jest.spyOn(cadastroDeTelefoneStub, 'inserir')
      const requisicaoHttp = {
        corpo: dadoFalso,
        metodo: 'POST'
      }
      await sut.tratar(requisicaoHttp)
      expect(inserirSpy).toHaveBeenCalledWith(+dadoFalso.numero, +dadoFalso.estacaoId)
    })

    test('Deve retornar status 500 caso o cadastroDeTelefone retorne um erro', async () => {
      const { sut, cadastroDeTelefoneStub } = makeSut()
      jest.spyOn(cadastroDeTelefoneStub, 'inserir').mockReturnValueOnce(Promise.reject(new Error()))
      const requisicaoHttp = {
        corpo: dadoFalso,
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })
  })
})
