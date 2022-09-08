import { Router } from 'express'
import { adaptadorDeMiddleware } from '../adaptadores/adaptador-de-middleware-express'
import { criaMiddlewareDeAutenticacao } from '../fabrica/middleware-de-autenticacao'
import { adaptadorDeRota } from '../adaptadores/adaptador-de-rota-express'
import { criaControladorDeAlerta } from '../fabrica/alerta'

export default (router: Router): Router => {
  const autentificacaoArea = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('3'))
  router.post('/alerta',autentificacaoArea, adaptadorDeRota(criaControladorDeAlerta())) // eslint-disable-line
  router.get('/alerta/:parametro?/:parametro2?', adaptadorDeRota(criaControladorDeAlerta())) // eslint-disable-line
  router.put('/alerta/:parametro', autentificacaoArea, adaptadorDeMiddleware(criaControladorDeAlerta())) // eslint-disable-line
  return router
}
