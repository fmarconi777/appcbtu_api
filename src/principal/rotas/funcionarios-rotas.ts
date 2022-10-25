import { adaptadorDeMiddleware } from '@/principal/adaptadores/adaptador-de-middleware-express'
import { criaMiddlewareDeAutenticacao } from '@/principal/fabrica/middleware-de-autenticacao'
import { adaptadorDeRota } from '@/principal/adaptadores/adaptador-de-rota-express'
import { criaControladorDeFuncionario } from '@/principal/fabrica/funcionario'
import { criaControladorDeLogin } from '@/principal/fabrica/login'
import { Router } from 'express'

export default (router: Router): Router => {
  const autentificacaoArea = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('admin'))
  router.post('/funcionario', autentificacaoArea, adaptadorDeRota(criaControladorDeFuncionario())) // eslint-disable-line
  router.post('/login', adaptadorDeRota(criaControladorDeLogin())) // eslint-disable-line
  return router
}
