import { Router } from 'express'
import { adaptadorDeRota } from '../adaptadores/adaptador-de-rota-express'
import { criaControladorDeEquipamento } from '../fabrica/equipamento'

export default (router: Router): Router => {
  return router.post('/equipamento', adaptadorDeRota(criaControladorDeEquipamento())) // eslint-disable-line
}
