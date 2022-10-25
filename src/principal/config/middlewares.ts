import { transformaCorpo } from '@/principal/middlewares/transforma-corpo'
import { cors } from '@/principal/middlewares/cors'
import { contentType } from '@/principal/middlewares/content-type'
import { Express } from 'express'

export default (app: Express): void => {
  app.use(transformaCorpo)
  app.use(cors)
  app.use(contentType)
}
