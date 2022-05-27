import bcrypt from 'bcrypt'
import { GeradorDeHash } from '../../dados/protocolos/criptografia/gerador-de-hash'
import 'dotenv/config'

export class BcryptAdaptador implements GeradorDeHash {
  private readonly salt: number = +(process.env.SALT as string)

  async gerar (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}
