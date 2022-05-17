import bcrypt from 'bcrypt'
import { Encriptador } from '../.././apresentacao/protocolos/encriptador'

export class BcryptAdaptador implements Encriptador {
  private readonly salt: number
  constructor (salt: number) {
    this.salt = salt
  }

  async encriptar (value: string): Promise<string> {
    await bcrypt.hash(value, this.salt)
    return await new Promise(resolve => resolve(''))
  }
}
