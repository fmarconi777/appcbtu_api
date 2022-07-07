import { Router } from 'express'
import { adaptadorDeMiddleware } from '../adaptadores/adaptador-de-middleware-express'
import { criaMiddlewareDeAutenticacao } from '../fabrica/middleware-de-autenticacao'
import { adaptadorDeRota } from '../adaptadores/adaptador-de-rota-express'
import { criaControladorDeEquipamento } from '../fabrica/equipamento'

export default (router: Router): Router => {
  const autentificacaoArea = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('3'))
  router.post('/equipamento', autentificacaoArea, adaptadorDeRota(criaControladorDeEquipamento())) // eslint-disable-line
  router.get('/equipamento', adaptadorDeRota(criaControladorDeEquipamento())) // eslint-disable-line
  return router
}
