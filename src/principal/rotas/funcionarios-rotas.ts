import { Router } from 'express'
import { adaptadorDeMiddleware } from '../adaptadores/adaptador-de-middleware-express'
import { criaMiddlewareDeAutenticacao } from '../fabrica/middleware-de-autenticacao'
import { adaptadorDeRota } from '../adaptadores/adaptador-de-rota-express'
import { criaControladorDeFuncionario } from '../fabrica/funcionario'
import { criaControladorDeLogin } from '../fabrica/login'

export default (router: Router): Router => {
  const autentificacaoArea = adaptadorDeMiddleware(criaMiddlewareDeAutenticacao('admin'))
  router.post('/funcionario', autentificacaoArea, adaptadorDeRota(criaControladorDeFuncionario())) // eslint-disable-line
  router.post('/login', adaptadorDeRota(criaControladorDeLogin())) // eslint-disable-line
  return router
}
