import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(join(__dirname, '../rotas')).map(async arquivo => {
    if (!arquivo.endsWith('.test.ts')) {
      const rota = (await import(`../rotas/${arquivo}`)).default(router)
      app.use(rota)
    }
  })
}
