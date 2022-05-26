import { Router } from 'express'
import { adaptadorDeRota } from '../adaptadores/adaptador-de-rota-express'
import { criaControladorDeFuncionario } from '../fabrica/funcionario'

export default (router: Router): Router => {
  router.post('/funcionario', adaptadorDeRota(criaControladorDeFuncionario())) // eslint-disable-line
  return router
}
