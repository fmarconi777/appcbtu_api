import { Sequelize } from 'sequelize'
import 'dotenv/config'

type Auxiliares = { // eslint-disable-line
  readonly bd: Sequelize
  cliente: null | Sequelize
  conectar: Function
  desconectar: Function
}

export const AuxiliaresMariaDB: Auxiliares = {
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

  cliente: null,

  async conectar (): Promise<void> {
    this.cliente = this.bd
    await this.cliente.authenticate()
  },

  async desconectar (): Promise<void> {
    if (this.cliente !== null) {
      await this.cliente.close()
    }
    this.cliente = null
  }
}
