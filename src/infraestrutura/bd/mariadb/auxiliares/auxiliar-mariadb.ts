import { Sequelize } from 'sequelize'
import 'dotenv/config'

export const bd = new Sequelize(
  process.env.NOME_BANCODEDADOS as string,
  process.env.USUARIO_BANCODEDADOS as string,
  process.env.SENHA_BANCODEDADOS,
  {
    dialect: 'mariadb',
    host: process.env.ENDERECO_BANCODEDADOS,
    port: +(process.env.PORTA_BANCODEDADOS as string)
  }
)
