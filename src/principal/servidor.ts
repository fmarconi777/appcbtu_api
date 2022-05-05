import { bd } from '../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import 'dotenv/config'

bd.authenticate()
  .then(async () => {
    const app = (await import('./config/app')).default
    console.log('Conexão estabelecida com sucesso.')
    app.listen(+(process.env.PORTA_APLICACAO as string), () => console.log(`Servidor rodando no endereço http://localhost:${+(process.env.PORTA_APLICACAO as string)}`))
  })
  .catch((error) => {
    console.error('Não foi possível conectar com o banco de dados:', error)
  })
