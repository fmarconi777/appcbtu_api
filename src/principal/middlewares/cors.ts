import { Request, Response, NextFunction } from 'express'
import 'dotenv/config'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-control-allow-origin', process.env.ORIGEM)
  res.set('access-control-allow-methods', process.env.METODO)
  res.set('access-control-allow-headers', process.env.CABECALHO)
  next()
}
