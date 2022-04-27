import { Express } from 'express'
import { transformaCorpo } from '../middlewares/transforma-corpo'
import { cors } from '../middlewares/cors'
import { contentType } from '../middlewares/content-type'

export default (app: Express): void => {
  app.use(transformaCorpo)
  app.use(cors)
  app.use(contentType)
}
