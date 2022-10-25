import { adaptadorDeMiddleware } from '@/principal/adaptadores/adaptador-de-middleware-express'
import { adaptadorDeRota } from '@/principal/adaptadores/adaptador-de-rota-express'
import { criaMiddlewareDeAutenticacao } from '@/principal/fabrica/middleware-de-autenticacao'
import { criaControladorDeTelefone } from '@/principal/fabrica/telefone'
import { Router } from 'express'

export default (router: Router): Router => {
  const autentificacaoArea = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('16'))
  router.post('/telefone', autentificacaoArea, adaptadorDeRota(criaControladorDeTelefone())) // eslint-disable-line
  return router
}
