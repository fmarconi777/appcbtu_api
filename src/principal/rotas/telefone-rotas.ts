import { Router } from 'express'
import { adaptadorDeMiddleware } from '../adaptadores/adaptador-de-middleware-express'
import { adaptadorDeRota } from '../adaptadores/adaptador-de-rota-express'
import { criaMiddlewareDeAutenticacao } from '../fabrica/middleware-de-autenticacao'
import { criaControladorDeTelefone } from '../fabrica/telefone'

export default (router: Router): Router => {
  const autentificacaoArea = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('16'))
  router.post('/telefone', autentificacaoArea, adaptadorDeRota(criaControladorDeTelefone())) // eslint-disable-line
  return router
}
