import { Router } from 'express'
import { adaptadorDeMiddleware } from '../adaptadores/adaptador-de-middleware-express'
import { adaptadorDeRota } from '../adaptadores/adaptador-de-rota-express'
import { criaControladorDeFalha } from '../fabrica/falha'
import { criaMiddlewareDeAutenticacao } from '../fabrica/middleware-de-autenticacao'

export default (router: Router): Router => {
  const autentificacaoArea = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('3'))
  router.post('/falha', autentificacaoArea, adaptadorDeRota(criaControladorDeFalha())) // eslint-disable-line
  router.get('/falha/:parametro?', autentificacaoArea, adaptadorDeRota(criaControladorDeFalha())) // eslint-disable-line
  return router
}
