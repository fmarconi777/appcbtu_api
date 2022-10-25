import 'module-alias/register'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import 'dotenv/config'

AuxiliaresMariaDB.conectar()
  .then(async () => {
    const app = (await import('./config/app')).default
    console.log('Conexão estabelecida com sucesso.')
    app.listen(+(process.env.PORTA_APLICACAO as string), () => console.log(`Servidor rodando no endereço http://localhost:${+(process.env.PORTA_APLICACAO as string)}`))
  })
  .catch((error: any) => {
    console.error('Não foi possível conectar com o banco de dados:', error)
  })
