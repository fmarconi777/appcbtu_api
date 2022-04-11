enum Sigla {
  uel,
  uci,
  uvo,
  ugm,
  ucl,
  ucp,
  ulg,
  uct,
  use,
  ust,
  uhf,
  usi,
  ujc,
  ums,
  usg,
  upm,
  uwl,
  ufl,
  uvl
}

/*
A função eSigla transforma o objeto Sigla em array e verifica se o
parâmetro recebido está no array, retornando assim um valor booleano.
*/

function eSigla (parametro: any): boolean {
  return Object.values(Sigla).includes(parametro)
}

export const validador = {
  eSigla
}
