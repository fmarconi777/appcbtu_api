import { ControladorDeFuncionario } from './funcionario'
import { CadastroDeFuncionario, InserirModeloFuncionario } from '@/dominio/casos-de-uso/funcionario/cadastro-de-funcionario'
import { ModeloFuncionario } from '@/dominio/modelos/funcionario'
import { ErroParametroInvalido } from '@/apresentacao/erros/erro-parametro-invalido'
import { Validador } from '@/apresentacao/protocolos/validador'
import { ErroDeServidor } from '@/apresentacao/erros/erro-de-servidor'
import { ErroMetodoInvalido } from '@/apresentacao/erros/erro-metodo-invalido'
import { ErroEmailEmUso } from '@/apresentacao/erros/erro-parametro-email-em-uso'
import { requisicaoNegada } from '@/apresentacao/auxiliares/auxiliar-http'

const makeCadastroDeFuncionario = (): CadastroDeFuncionario => {
  class CadastroDeFuncionarioStub implements CadastroDeFuncionario {
    async adicionar (conta: InserirModeloFuncionario): Promise<ModeloFuncionario> {
      const contafalsa = {
        id: 'id_valido',
        nome: 'nome_valido',
        email: 'email_valido@mail.com',
        senha: 'senha_valido',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida'
      }
      return await new Promise(resolve => resolve(contafalsa))
    }
  }
  return new CadastroDeFuncionarioStub()
}

class ValidadorDeEmailStub implements Validador {
  validar (email: string): boolean {
    return true
  }
}

interface SutTipos {
  sut: ControladorDeFuncionario
  validadorDeEmailStub: Validador
  cadastroDeFuncionarioStub: CadastroDeFuncionario
}

const makeSut = (): SutTipos => {
  const cadastroDeFuncionarioStub = makeCadastroDeFuncionario()
  const validadorDeEmailStub = new ValidadorDeEmailStub()
  const sut = new ControladorDeFuncionario(validadorDeEmailStub, cadastroDeFuncionarioStub)
  return {
    sut,
    validadorDeEmailStub,
    cadastroDeFuncionarioStub
  }
}

describe('Controlador de Cadastro', () => {
  test('Retornar 400 quando o nome não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('nome'))
  })
  test('Retornar 400 quando o email não for fornecido', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    jest.spyOn(validadorDeEmailStub, 'validar').mockReturnValueOnce(false)
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('email'))
  })
  test('Deverá chamar ValidadorDeEmail quando o email correto for fornecido', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    const validarEspionar = jest.spyOn(validadorDeEmailStub, 'validar')
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      },
      metodo: 'POST'
    }
    await sut.tratar(requisicaoHttp)
    expect(validarEspionar).toHaveBeenLastCalledWith('qualquer_email@mail.com')
  })

  test('Retornar 400 quando a areaId não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        confirmarSenha: 'qualquer_senha'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('areaId'))
  })

  test('Retornar 400 quando a senha não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        email: 'qualquer_email@mail.com',
        confirmarSenha: 'qualquer_senha'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('senha'))
  })

  test('Retornar 400 quando o confirmarsenha não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('confirmarSenha'))
  })

  test('Retornar 400 quando a confirmação de senha falhar', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'invalida_senha'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('confirmarSenha'))
  })

  test('Retornar 400 quando o email for invalido', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    jest.spyOn(validadorDeEmailStub, 'validar').mockReturnValueOnce(false)
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'email_invalido',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('email'))
  })

  test('Deve retornar codigo 400 se um método não suportado for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'email_invalido',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      },
      metodo: 'metodo_invalido'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroMetodoInvalido())
  })

  test('Deverá retornar status 403 se o CadastroDeFuncionario retornar null', async () => {
    const { sut, cadastroDeFuncionarioStub } = makeSut()
    jest.spyOn(cadastroDeFuncionarioStub, 'adicionar').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp).toEqual(requisicaoNegada(new ErroEmailEmUso()))
  })

  test('Deverá retornar status 200 quando os valores corretos forem fornecidos', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(200)
    expect(respostaHttp.corpo).toEqual({
      id: 'id_valido',
      nome: 'nome_valido',
      email: 'email_valido@mail.com',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'idarea_valida'
    })
  })

  test('Retornar 500 quando o ValidadorDeEmail retornar uma excessão', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    const erroFalso = new Error()
    erroFalso.stack = 'stack_qualquer'
    jest.spyOn(validadorDeEmailStub, 'validar').mockImplementationOnce(() => {
      throw erroFalso
    })
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      },
      metodo: 'POST'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(500)
    expect(respostaHttp.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
  })
})
