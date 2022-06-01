import { Sequelize } from 'sequelize'
import 'dotenv/config'

export const AuxiliaresMariaDB = {
  bd: new Sequelize(
    process.env.NOME_BANCODEDADOS as string,
    process.env.USUARIO_BANCODEDADOS as string,
    process.env.SENHA_BANCODEDADOS,
    {
      dialect: 'mariadb',
      host: process.env.ENDERECO_BANCODEDADOS,
      port: +(process.env.PORTA_BANCODEDADOS as string)
    }
  ),

  async conectar (): Promise<void> {
    await this.bd.authenticate()
  },

  async desconectar (): Promise<void> {
    await this.bd.close()
  }
}
