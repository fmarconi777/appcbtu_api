import { Request, Response } from 'express'
import { Controlador } from '../../apresentacao/protocolos/controlador'
import { RequisicaoHttp } from '../../apresentacao/protocolos/http'

export const adaptadorDeRota = (controlador: Controlador) => {
  return async (req: Request, res: Response) => {
    const requisicaoHttp: RequisicaoHttp = {
      corpo: req.body,
      parametro: req.params.parametro
    }
    const respostaHttp = await controlador.tratar(requisicaoHttp)
    if (respostaHttp.status === 200) {
      res.status(respostaHttp.status).json(respostaHttp.corpo)
    } else {
      res.status(respostaHttp.status).json({ erro: respostaHttp.corpo.message })
    }
  }
}
