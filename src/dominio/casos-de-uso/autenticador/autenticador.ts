export interface ModeloAutenticacao {
  email: string
  senha: string
}

export interface Autenticador {
  autenticar: (atenticacao: ModeloAutenticacao) => Promise<string>
}
