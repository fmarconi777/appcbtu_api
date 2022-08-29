export interface CadastroAdministrador {
  cadastrar: (senha: string) => Promise<string>
}
