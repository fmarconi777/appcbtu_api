import { Router } from 'express'
import { adaptadorDeMiddleware } from '../adaptadores/adaptador-de-middleware-express'
import { criaMiddlewareDeAutenticacao } from '../fabrica/middleware-de-autenticacao'
import { adaptadorDeRota } from '../adaptadores/adaptador-de-rota-express'
import { criaControladorDeEquipamento } from '../fabrica/equipamento'

export default (router: Router): Router => {
  const autentificacaoArea = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('3'))
  const autentificacaoAdmin = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('admin'))
  router.post('/equipamento', autentificacaoArea, adaptadorDeRota(criaControladorDeEquipamento())) // eslint-disable-line
  router.get('/equipamento/:parametro?', adaptadorDeRota(criaControladorDeEquipamento())) // eslint-disable-line
  router.put('/equipamento/:parametro', autentificacaoAdmin, adaptadorDeRota(criaControladorDeEquipamento())) // eslint-disable-line
  router.patch('/equipamento/:parametro', autentificacaoArea, adaptadorDeRota(criaControladorDeEquipamento())) // eslint-disable-line
  router.delete('/equipamento/:parametro', autentificacaoAdmin, adaptadorDeMiddleware(criaControladorDeEquipamento())) // eslint-disable-line
  return router
}
