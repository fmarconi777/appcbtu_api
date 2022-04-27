import { Express } from 'express'
import { transformaCorpo } from '../middlewares/transforma-corpo'
import { cors } from '../middlewares/cors'

export default (app: Express): void => {
  app.use(transformaCorpo)
  app.use(cors)
}
