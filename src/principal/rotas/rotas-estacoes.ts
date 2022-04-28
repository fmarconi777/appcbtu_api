import { Router } from 'express'

export default (router: Router): Router => {
  return router.get('/estacao/:sigla?', (req, res) => {
    res.json({ retorna: 'estação' })
  })
}
