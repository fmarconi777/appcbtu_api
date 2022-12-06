import conexao from '@/infraestrutura/sequelize/models/index'
import { Sequelize } from 'sequelize'

const conexaoSequelize = conexao.sequelize

export const AuxiliaresMariaDB = {
  cliente: null as unknown as Sequelize,

  ambiente: '',

  async conectar (env: string): Promise<void> {
    this.ambiente = env
    process.env.NODE_ENV = env
    this.cliente = conexaoSequelize
    await this.cliente.authenticate()
  },

  async desconectar (): Promise<void> {
    if (this.cliente !== null) {
      await this.cliente.close()
    }
    this.cliente = null as unknown as Sequelize
  },

  async verificaConexao (): Promise<void> {
    if (!this.cliente?.authenticate()) { // eslint-disable-line
      await this.conectar(this.ambiente)
    }
  }
}
