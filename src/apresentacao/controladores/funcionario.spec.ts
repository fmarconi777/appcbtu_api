import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ControladorDeFuncionario } from './funcionario'
import { Validador } from '../protocolos/validador'
import { ErroDeServidor } from '../erros/erro-de-servidor'
import { AdicionarConta, InserirModeloFuncionario } from '../../dominio/casos-de-uso/adicionarconta/cadastro-de-funcionario'
import { ModeloFuncionario } from '../../dominio/modelos/cadastrofuncionario'
interface SutTipos {
  sut: ControladorDeFuncionario
  validadorDeEmailStub: Validador
  adicionarContaStub: AdicionarConta
}
const makeAdicionarConta = (): AdicionarConta => {
  class AdicionarContaStub implements AdicionarConta {
    async adicionar (conta: InserirModeloFuncionario): Promise<ModeloFuncionario> {
      const contafalsa = {
        id: 'id_valido',
        nome: 'nome_valido',
        area: 'area_valido',
        email: 'email_valido@mail.com',
        senha: 'senha_valido',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida'
      }
      return await new Promise(resolve => resolve(contafalsa))
    }
  }
  return new AdicionarContaStub()
}
class ValidadorDeEmailStub implements Validador {
  validar (email: string): boolean {
    return true
  }
}
const makeSut = (): SutTipos => {
  const adicionarContaStub = makeAdicionarConta()
  const validadorDeEmailStub = new ValidadorDeEmailStub()
  const sut = new ControladorDeFuncionario(validadorDeEmailStub, adicionarContaStub)
  return {
    sut,
    validadorDeEmailStub,
    adicionarContaStub
  }
}

describe('Controlador de Cadastro', () => {
  test('Retornar 400 quando o nome não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        area: 'qualquer_area',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      }
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
        area: 'qualquer_area',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      }
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
        area: 'qualquer_area',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      }
    }
    await sut.tratar(requisicaoHttp)
    expect(validarEspionar).toHaveBeenLastCalledWith('qualquer_email@mail.com')
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
        area: 'qualquer_area',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(500)
    expect(respostaHttp.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
  })

  test('Retornar 400 quando a area não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('area'))
  })
  test('Retornar 400 quando a senha não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        area: 'qualquer_area',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        email: 'qualquer_email@mail.com',
        confirmarSenha: 'qualquer_senha'
      }
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
        area: 'qualquer_area',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida'
      }
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
        area: 'qualquer_area',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'invalida_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('confirmarSenha'))
  })
  test('Deverá chamar AdicionarConta quando os valores corretos forem fornecidos', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        area: 'qualquer_area',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(200)
    expect(respostaHttp.corpo).toEqual({
      id: 'id_valido',
      nome: 'nome_valido',
      area: 'area_valido',
      email: 'email_valido@mail.com',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'idarea_valida'
    })
  })
  test('Retornar 400 quando o email for invalido', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    jest.spyOn(validadorDeEmailStub, 'validar').mockReturnValueOnce(false)
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        area: 'qualquer_area',
        email: 'email_invalido',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('email'))
  })
})
