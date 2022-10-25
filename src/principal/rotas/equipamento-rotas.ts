import { adaptadorDeMiddleware } from '@/principal/adaptadores/adaptador-de-middleware-express'
import { criaMiddlewareDeAutenticacao } from '@/principal/fabrica/middleware-de-autenticacao'
import { adaptadorDeRota } from '@/principal/adaptadores/adaptador-de-rota-express'
import { criaControladorDeEquipamento } from '@/principal/fabrica/equipamento'
import { Router } from 'express'

export default (router: Router): Router => {
  const autentificacaoArea = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('16'))
  const autentificacaoAdmin = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('admin'))
  router.post('/equipamento', autentificacaoArea, adaptadorDeRota(criaControladorDeEquipamento())) // eslint-disable-line
  router.get('/equipamento/:parametro?', adaptadorDeRota(criaControladorDeEquipamento())) // eslint-disable-line
  router.put('/equipamento/:parametro', autentificacaoAdmin, adaptadorDeRota(criaControladorDeEquipamento())) // eslint-disable-line
  router.patch('/equipamento/:parametro', autentificacaoArea, adaptadorDeRota(criaControladorDeEquipamento())) // eslint-disable-line
  router.delete('/equipamento/:parametro', autentificacaoAdmin, adaptadorDeRota(criaControladorDeEquipamento())) // eslint-disable-line
  return router
}
