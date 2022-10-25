import { adaptadorDeMiddleware } from '@/principal/adaptadores/adaptador-de-middleware-express'
import { adaptadorDeRota } from '@/principal/adaptadores/adaptador-de-rota-express'
import { criaControladorDeArea } from '@/principal/fabrica/area'
import { criaMiddlewareDeAutenticacao } from '@/principal/fabrica/middleware-de-autenticacao'
import { Router } from 'express'

export default (router: Router): Router => {
  const autentificacao = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao())
  const autentificacaoAdmin = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('admin'))
  router.get('/area/:parametro?',autentificacao, adaptadorDeRota(criaControladorDeArea())) // eslint-disable-line
  router.post('/area', autentificacaoAdmin, adaptadorDeRota(criaControladorDeArea())) // eslint-disable-line
  router.delete('/area/:parametro', autentificacaoAdmin, adaptadorDeRota(criaControladorDeArea())) // eslint-disable-line
  router.patch('/area/:parametro', autentificacaoAdmin, adaptadorDeRota(criaControladorDeArea())) // eslint-disable-line
  return router
}
