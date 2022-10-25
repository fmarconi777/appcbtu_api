import { ControladorDeTelefone } from './telefone'
import { CadastroDeTelefone, DadosTelefone } from '@/dominio/casos-de-uso/telefone/cadastro-de-telefone'
import { erroDeServidor, requisicaoImpropria, resposta } from '@/apresentacao/auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '@/apresentacao/erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '@/apresentacao/erros/erro-metodo-invalido'
import { ErroParametroInvalido } from '@/apresentacao/erros/erro-parametro-invalido'

const dadoFalso = {
  numero: '3132505555',
  estacaoId: '1'
}

const makeCadastroDeTelefoneStub = (): CadastroDeTelefone => {
  class CadastroDeTelefoneStub implements CadastroDeTelefone {
    async inserir (dados: DadosTelefone): Promise<string | null> {
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
      expect(inserirSpy).toHaveBeenCalledWith({ numero: +dadoFalso.numero, estacaoId: +dadoFalso.estacaoId })
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

    test('Deve retornar status 400 caso o cadastroDeTelefone retorne null', async () => {
      const { sut, cadastroDeTelefoneStub } = makeSut()
      jest.spyOn(cadastroDeTelefoneStub, 'inserir').mockReturnValueOnce(Promise.resolve(null))
      const requisicaoHttp = {
        corpo: dadoFalso,
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoImpropria(new ErroParametroInvalido('estacaoId')))
    })

    test('Deve retornar status 200 caso de sucesso ao cadastrar o telefone', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: dadoFalso,
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(resposta('Telefone cadastrado com sucesso'))
    })
  })
})
