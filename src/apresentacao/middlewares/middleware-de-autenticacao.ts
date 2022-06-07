import { Middleware } from '../protocolos/middleware'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { requisicaoNegada } from '../auxiliares/auxiliar-http'
import { ErroAcessoNegado } from '../erros/erro-acesso-negado'
import { ConsultaFuncionarioPeloToken } from '../../dominio/casos-de-uso/middleware/consulta-funcionario-por-token'

export class MiddlewareDeAutenticacao implements Middleware {
  constructor (
    private readonly consultaFuncionarioPeloToken: ConsultaFuncionarioPeloToken
  ) {}

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const tokenDeAcesso = requisicaoHttp.cabecalho?.['x-access-token']
    if (tokenDeAcesso) { //eslint-disable-line
      await this.consultaFuncionarioPeloToken.consultar(tokenDeAcesso)
    }
    return requisicaoNegada(new ErroAcessoNegado())
  }
}
