import { NextFunction, Request, Response } from 'express'
import { RequisicaoHttp } from '../../apresentacao/protocolos/http'
import { Middleware } from '../../apresentacao/protocolos/middleware'

export const adaptadorDeMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const autorizacao: any = req.headers.authorization
    const [, tokenDeAcesso] = autorizacao?.split(' ')
    const requisicaoHttp: RequisicaoHttp = {
      cabecalho: tokenDeAcesso
    }
    const respostaHttp = await middleware.tratar(requisicaoHttp)
    if (respostaHttp.status === 200) {
      Object.assign(req, respostaHttp.corpo)
      next()
    } else {
      res.status(respostaHttp.status).json({ erro: respostaHttp.corpo.message })
    }
  }
}
