// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

module.exports = {
  development: {
    database: process.env.NOME_BANCODEDADOS,
    username: process.env.USUARIO_BANCODEDADOS,
    password: process.env.SENHA_BANCODEDADOS,
    host: process.env.ENDERECO_BANCODEDADOS,
    dialect: process.env.DIALECT_BANCODEDADOS,
    logging: false
  },
  test: {
    database: process.env.JEST_NOME_BANCODEDADOS,
    username: process.env.JEST_USUARIO_BANCODEDADOS,
    password: process.env.JEST_SENHA_BANCODEDADOS,
    host: process.env.JEST_ENDERECO_BANCODEDADOS,
    port: process.env.JEST_PORTA_BANCODEDADOS,
    dialect: process.env.JEST_DIALECT_BANCODEDADOS,
    logging: false
  }
}
