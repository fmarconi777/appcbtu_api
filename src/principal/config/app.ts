import configuraMiddlewares from './middlewares'
import configuraRotas from './rotas'
import { middlewareDeAdministrador } from './conta-administrador'
import express from 'express'

const app = express()
configuraMiddlewares(app)
configuraRotas(app)
middlewareDeAdministrador.criarAdmin() // middlewareDeAdministrador deve ser colocado como comentário antes de realizar os testes
export default app
