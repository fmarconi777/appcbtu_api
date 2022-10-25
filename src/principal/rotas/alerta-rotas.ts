import { adaptadorDeMiddleware } from '@/principal/adaptadores/adaptador-de-middleware-express'
import { criaMiddlewareDeAutenticacao } from '@/principal/fabrica/middleware-de-autenticacao'
import { adaptadorDeRota } from '@/principal/adaptadores/adaptador-de-rota-express'
import { criaControladorDeAlerta } from '@/principal/fabrica/alerta'
import { Router } from 'express'

export default (router: Router): Router => {
  const autentificacaoArea = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('16'))
  router.post('/alerta',autentificacaoArea, adaptadorDeRota(criaControladorDeAlerta())) // eslint-disable-line
  router.get('/alerta/:parametro?/:parametro2?', adaptadorDeRota(criaControladorDeAlerta())) // eslint-disable-line
  router.patch('/alerta/:parametro', autentificacaoArea, adaptadorDeRota(criaControladorDeAlerta())) // eslint-disable-line
  router.delete('/alerta/:parametro', autentificacaoArea, adaptadorDeRota(criaControladorDeAlerta())) // eslint-disable-line
  return router
}
