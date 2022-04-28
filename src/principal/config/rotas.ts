import { Express, Router } from 'express'
import getEstacao from '../rotas/rotas-estacoes'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  app.use(getEstacao(router))
}
