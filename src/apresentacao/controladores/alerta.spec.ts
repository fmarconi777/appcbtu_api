import { ControladorDeAlerta } from './alerta'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroAlerta, DadosAlerta } from '../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ModeloAlerta } from '../../dominio/modelos/alerta'
import { ErroDeServidor } from '../erros/erro-de-servidor'

const makeCadastroAlerta = (): CadastroAlerta => {
  class CadastroDeAlertaStub implements CadastroAlerta {
    async inserir (alerta: DadosAlerta): Promise<ModeloAlerta> {
      const alertaFalso = {
        id: 'qualquer_id',
        descricao: alerta.descricao,
        prioridade: alerta.prioridade,
        dataInicio: alerta.dataInicio,
        dataFim: alerta.dataFim,
        ativo: alerta.ativo,
        estacaoId: alerta.estacaoId
      }
      return await new Promise(resolve => resolve(alertaFalso))
    }
  }
  return new CadastroDeAlertaStub()
}

interface SutTypes {
  sut: ControladorDeAlerta
  cadastroDeAlertaStub: CadastroAlerta
}

const makeSut = (): SutTypes => {
  const cadastroDeAlertaStub = makeCadastroAlerta()
  const sut = new ControladorDeAlerta(cadastroDeAlertaStub)
  return {
    sut,
    cadastroDeAlertaStub
  }
}

describe('Controlador de Alerta', () => {
  test('Deve retornar codigo 400 se uma descrição não for fornecida', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        prioridade: 'qualquer_prioridade',
        dataInicio: 'iniciodata_qualquer',
        dataFim: 'fimdata_qualquer',
        ativo: 'ativo_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('descricao'))
  })
  test('Deve retornar codigo 400 se uma prioridade não for fornecida', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        descricao: 'qualquer_descricao',
        dataInicio: 'iniciodata_qualquer',
        dataFim: 'fimdata_qualquer',
        ativo: 'ativo_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('prioridade'))
  })
  test('Deve retornar codigo 400 se um Inicio de Data não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        descricao: 'qualquer_descricao',
        prioridade: 'qualquer_prioridade',
        dataFim: 'datafim_qualquer',
        ativo: 'ativo_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('dataInicio'))
  })
  test('Deve retornar codigo 400 se um Fim de Data não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        descricao: 'qualquer_descricao',
        prioridade: 'qualquer_prioridade',
        dataInicio: 'iniciodata_qualquer',
        ativo: 'ativo_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('dataFim'))
  })
  test('Deve retornar codigo 400 se um estado de ativo não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        descricao: 'qualquer_descricao',
        prioridade: 'qualquer_prioridade',
        dataInicio: 'iniciodata_qualquer',
        dataFim: 'fimdata_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('ativo'))
  })
  test('Deve retornar codigo 400 se um id de estação não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        descricao: 'qualquer_descricao',
        prioridade: 'qualquer_prioridade',
        dataInicio: 'iniciodata_qualquer',
        dataFim: 'fimdata_qualquer',
        ativo: 'ativo_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('estacaoId'))
  })

  test('Deve chamar o CadastroDeAlerta com os valores corretos', async () => {
    const { sut, cadastroDeAlertaStub } = makeSut()
    const inserirSpy = jest.spyOn(cadastroDeAlertaStub, 'inserir')
    const requisicaoHttp = {
      corpo: {
        descricao: 'qualquer_descricao',
        prioridade: 'qualquer_prioridade',
        dataInicio: 'iniciodata_qualquer',
        dataFim: 'fimdata_qualquer',
        ativo: 'ativo_qualquer',
        estacaoId: 'estacaoId_qualquer'

      }
    }
    await sut.tratar(requisicaoHttp)
    expect(inserirSpy).toHaveBeenCalledWith({
      descricao: 'qualquer_descricao',
      prioridade: 'qualquer_prioridade',
      dataInicio: 'iniciodata_qualquer',
      dataFim: 'fimdata_qualquer',
      ativo: 'ativo_qualquer',
      estacaoId: 'estacaoId_qualquer'
    })
  })
  test('Deve retornar codigoo 500 se o CadastroDeAlerta retornar um erro', async () => {
    const { sut, cadastroDeAlertaStub } = makeSut()
    const erroFalso = new Error()
    erroFalso.stack = 'stack_qualquer'
    jest.spyOn(cadastroDeAlertaStub, 'inserir').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(erroFalso))
    })
    const requisicaoHttp = {
      corpo: {
        descricao: 'qualquer_descricao',
        prioridade: 'qualquer_prioridade',
        dataInicio: 'iniciodata_qualquer',
        dataFim: 'fimdata_qualquer',
        ativo: 'ativo_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(500)
    expect(respostaHttp.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
  })
  test('Deve retornar codigoo 200 se dados válidos forem passados', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        descricao: 'qualquer_descricao',
        prioridade: 'qualquer_prioridade',
        dataInicio: 'iniciodata_qualquer',
        dataFim: 'fimdata_qualquer',
        ativo: 'ativo_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(200)
    expect(respostaHttp.corpo).toEqual({
      id: 'qualquer_id',
      descricao: 'qualquer_descricao',
      prioridade: 'qualquer_prioridade',
      dataInicio: 'iniciodata_qualquer',
      dataFim: 'fimdata_qualquer',
      ativo: 'ativo_qualquer',
      estacaoId: 'estacaoId_qualquer'
    })
  })
})
