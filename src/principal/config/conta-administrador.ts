import { AuxiliaresMariaDB } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { hash } from 'bcrypt'
import 'dotenv/config'

export default async function admin (): Promise<void> {
  const salt = process.env.SALT ?? 12
  const senha = await hash('123', +salt)
  await AuxiliaresMariaDB.bd.query(`insert into Funcionario (nome, email, senha, administrador, areaId)
  select * from (select 'admin' as nome, 'admin@email.com' as email, '${senha}' as senha, true as administrador, 9 as areaId) as admin
  where not exists (select nome from Funcionario where nome = 'admin') limit 1;`)
}
