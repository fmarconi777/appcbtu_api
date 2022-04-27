import express from 'express'
import configuraMiddlewares from './middlewares'

const app = express()
configuraMiddlewares(app)
export default app
