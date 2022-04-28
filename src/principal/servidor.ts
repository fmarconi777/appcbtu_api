import { bd } from '../infraestrutura/db/mariadb/auxiliares/auxiliar-mariadb'

bd.authenticate()
  .then(async () => {
    const app = (await import('./config/app')).default
    console.log('Conexão estabelecida com sucesso.')
    app.listen(5000, () => console.log('Servidor rodando no endereço http://localhost:5000'))
  })
  .catch((error) => {
    console.error('Não foi possível conectar com o banco de dados:', error)
  })
