import { Router } from 'express'
import { adaptadorDeMiddleware } from '../adaptadores/adaptador-de-middleware-express'
import { adaptadorDeRota } from '../adaptadores/adaptador-de-rota-express'
import { criaControladorDeArea } from '../fabrica/area'
import { criaMiddlewareDeAutenticacao } from '../fabrica/middleware-de-autenticacao'

export default (router: Router): Router => {
  const autentificacao = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao())
  router.get('/area/:parametro?',autentificacao, adaptadorDeRota(criaControladorDeArea())) // eslint-disable-line
  return router
}
