import express from 'express'
import configuraMiddlewares from './middlewares'
import configuraRotas from './rotas'

const app = express()
configuraMiddlewares(app)
configuraRotas(app)
export default app
