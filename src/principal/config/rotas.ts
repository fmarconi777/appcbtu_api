import { Express, Router } from 'express'
import fg from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  fg.sync('**/src/principal/rotas/**rotas.ts').map(async arquivo => {
    const rota = (await import(`../../../${arquivo}`)).default(router)
    app.use(rota)
  })
}
