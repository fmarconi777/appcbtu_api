import { adaptadorDeRota } from '@/principal/adaptadores/adaptador-de-rota-express'
import { criaControladorDeEstacao } from '@/principal/fabrica/estacao'
import { Router } from 'express'

export default (router: Router): Router => {
  router.get('/estacao/:parametro?', adaptadorDeRota(criaControladorDeEstacao())) // eslint-disable-line
  return router
}
