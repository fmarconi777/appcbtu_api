export interface CadastroAdministrador {
  cadastrar: (senha: string, email: string) => Promise<string>
}
