import { Router } from 'express'
import { adaptadorDeMiddleware } from '../adaptadores/adaptador-de-middleware-express'
import { adaptadorDeRota } from '../adaptadores/adaptador-de-rota-express'
import { criaControladorDeArea } from '../fabrica/area'
import { criaMiddlewareDeAutenticacao } from '../fabrica/middleware-de-autenticacao'

export default (router: Router): Router => {
  const autentificacao = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao())
  const autentificacaoAdmin = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('admin'))
  router.get('/area/:parametro?',autentificacao, adaptadorDeRota(criaControladorDeArea())) // eslint-disable-line
  router.post('/area', autentificacaoAdmin, adaptadorDeRota(criaControladorDeArea())) // eslint-disable-line
  router.delete('/area/:parametro', autentificacaoAdmin, adaptadorDeRota(criaControladorDeArea())) // eslint-disable-line
  router.patch('/area/:parametro', autentificacaoAdmin, adaptadorDeRota(criaControladorDeArea())) // eslint-disable-line
  return router
}
