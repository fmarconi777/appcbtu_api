import { RequisicaoHttp } from '../protocolos/http'

export class ControladorDeCadastro {
  tratar (requisicaoHttp: RequisicaoHttp): any {
    if (!requisicaoHttp.corpo.nome) { // eslint-disable-line
      return {
        status: 400,
        corpo: new Error('Falta parametro: nome ')
      }
    }
    if (!requisicaoHttp.corpo.email) { // eslint-disable-line
      return {
        status: 400,
        corpo: new Error('Falta parametro: email ')
      }
    }
    if (!requisicaoHttp.corpo.area) { // eslint-disable-line
      return {
        status: 400,
        corpo: new Error('Falta parametro: area ')
      }
    }
    if (!requisicaoHttp.corpo.senha) { // eslint-disable-line
      return {
        status: 400,
        corpo: new Error('Falta parametro: senha ')
      }
    }
    if (!requisicaoHttp.corpo.confirmarSenha) { // eslint-disable-line
      return {
        status: 400,
        corpo: new Error('Falta parametro: confirmarSenha ')
      }
    }
  }
}
