import { Express } from 'express'
import { transformaCorpo } from '../middlewares/transforma-corpo'

export default (app: Express): void => {
  app.use(transformaCorpo)
}
