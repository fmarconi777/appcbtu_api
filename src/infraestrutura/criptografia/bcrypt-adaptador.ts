import bcrypt from 'bcrypt'
import { GeradorDeHash } from '../../dados/protocolos/criptografia/gerador-de-hash'
import 'dotenv/config'
import { ComparadorHash } from '../../dados/protocolos/criptografia/comparador-hash'

export class BcryptAdaptador implements GeradorDeHash, ComparadorHash {
  private readonly salt: number = +(process.env.SALT as string)

  async gerar (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async comparar (valor: string, hash: string): Promise<boolean> {
    const coincide = await bcrypt.compare(valor, hash)
    return coincide
  }
}
