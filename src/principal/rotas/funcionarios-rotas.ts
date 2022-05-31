import { Router } from 'express'
import { adaptadorDeRota } from '../adaptadores/adaptador-de-rota-express'
import { criaControladorDeFuncionario } from '../fabrica/funcionario'
import { criaControladorDeLogin } from '../fabrica/login'

export default (router: Router): Router => {
  router.post('/funcionario', adaptadorDeRota(criaControladorDeFuncionario())) // eslint-disable-line
  router.post('/login', adaptadorDeRota(criaControladorDeLogin())) // eslint-disable-line
  return router
}
