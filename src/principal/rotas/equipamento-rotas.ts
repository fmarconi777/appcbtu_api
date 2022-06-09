import { Router } from 'express'
import { adaptadorDeMiddleware } from '../adaptadores/adaptador-de-middleware-express'
import { adaptadorDeRota } from '../adaptadores/adaptador-de-rota-express'
import { criaControladorDeEquipamento } from '../fabrica/equipamento'
import { criaMiddlewareDeAutenticacao } from '../fabrica/middleware-de-autenticacao'

export default (router: Router): Router => {
  const autentificacaoArea = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('3'))
  router.post('/equipamento', autentificacaoArea, adaptadorDeRota(criaControladorDeEquipamento())) // eslint-disable-line
  return router
}
