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

function eSigla (parametro: any): boolean {
  return Object.values(Sigla).includes(parametro)
}

export const validador = {
  eSigla
}
