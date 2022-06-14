import { AuxiliaresMariaDB } from '../../infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { BcryptAdaptador } from '../../infraestrutura/criptografia/bcrypt-adaptador/bcrypt-adaptador'

export default async function admin (): Promise<void> {
  const bcryptAdaptador = new BcryptAdaptador()
  const senha = await bcryptAdaptador.gerar('123')
  const query = `insert into Funcionario (nome, email, senha, administrador, areaId)
  select * from (select 'admin' as nome, 'admin@email.com' as email, '${senha}' as senha, true as administrador, 9 as areaId) as admin
  where not exists (select nome from Funcionario where nome = 'admin') limit 1;`
  await AuxiliaresMariaDB.cliente?.query(query)
}
