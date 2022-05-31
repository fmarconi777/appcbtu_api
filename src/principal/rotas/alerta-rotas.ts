import { Router } from 'express'
import { adaptadorDeRota } from '../adaptadores/adaptador-de-rota-express'
import { criaControladorDeAlerta } from '../fabrica/alerta'

export default (router: Router): Router => {
  router.post('/alerta', adaptadorDeRota(criaControladorDeAlerta())) // eslint-disable-line
  return router
}
