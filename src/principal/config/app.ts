import express from 'express'
import configuraMiddlewares from './middlewares'
import configuraRotas from './rotas'
import admin from './conta-administrador'

const app = express()
configuraMiddlewares(app)
configuraRotas(app)
admin().catch(erro => (console.error(erro)))
export default app
