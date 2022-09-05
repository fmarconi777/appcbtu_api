import { LeitorDeTerminal } from '../../../../dominio/casos-de-uso/middleware/terminal/leitor-de-terminal'
import readlineSync from 'readline-sync'
import { LeitorDeSenhaTerminal } from '../../../../dominio/casos-de-uso/middleware/terminal/leitor-de-senha-terminal'

export class AdaptadorDoReadlineSync implements LeitorDeTerminal, LeitorDeSenhaTerminal {
  perguntarEmail (pergunta: any): string {
    const input = readlineSync.questionEMail(pergunta)
    return input
  }

  perguntarSenha (pergunta: any): string {
    const senha = readlineSync.questionNewPassword(pergunta)
    return senha
  }
}
