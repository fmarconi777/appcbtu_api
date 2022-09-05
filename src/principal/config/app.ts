import express from 'express'
import configuraMiddlewares from './middlewares'
import configuraRotas from './rotas'
import { middlewareDeAdministrador } from './conta-administrador'

const app = express()
configuraMiddlewares(app)
configuraRotas(app)
middlewareDeAdministrador.criarAdmin() // middlewareDeAdministrador deve ser colocado como comentário antes de realizar os testes
export default app
