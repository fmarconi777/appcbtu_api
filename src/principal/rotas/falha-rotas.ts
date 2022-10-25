import { adaptadorDeMiddleware } from '@/principal/adaptadores/adaptador-de-middleware-express'
import { adaptadorDeRota } from '@/principal/adaptadores/adaptador-de-rota-express'
import { criaControladorDeFalha } from '@/principal/fabrica/falha'
import { criaMiddlewareDeAutenticacao } from '@/principal/fabrica/middleware-de-autenticacao'
import { Router } from 'express'

export default (router: Router): Router => {
  const autentificacaoArea = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('16'))
  router.post('/falha', autentificacaoArea, adaptadorDeRota(criaControladorDeFalha())) // eslint-disable-line
  router.get('/falha/:parametro?', autentificacaoArea, adaptadorDeRota(criaControladorDeFalha())) // eslint-disable-line
  router.patch('/falha/:parametro', autentificacaoArea, adaptadorDeRota(criaControladorDeFalha())) // eslint-disable-line
  return router
}
