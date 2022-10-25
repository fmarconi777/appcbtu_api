export interface ValidadorBD {
  validar: (parametro: any) => Promise<boolean>
}
