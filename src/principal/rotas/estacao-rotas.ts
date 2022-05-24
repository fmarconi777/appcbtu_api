import { Router } from 'express'
import { adaptadorDeRota } from '../adaptadores/adaptador-de-rota-express'
import { criaControladorDeEstacao } from '../fabrica/estacao'

export default (router: Router): Router => {
  router.get('/estacao/:parametro?', adaptadorDeRota(criaControladorDeEstacao())) // eslint-disable-line
  return router
}
