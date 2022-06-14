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

enum Area {
  STUGAB,
  GOMAK,
  GOJUR,
  GOLIC,
  GIPLA,
  GIOBR,
  GIOPE,
  COASU,
  COINF,
  COPLO,
  COPRO,
  COIMP,
  GOCOP,
  GOEST,
  GOMOV,
  COPPO,
  GOSEG,
  COSOP,
  COSEP,
  GIMAN,
  GOMAR,
  GOSIP,
  COMAN,
  CORET,
  COMEP,
  COFEM,
  COPEM,
  COOEL,
  COVIP,
  COELO,
  COELI,
  GIAFI,
  GOPAT,
  GOREH,
  GOMAT,
  GOFIN,
  COSER,
  COEXP,
  CODES,
  COARH,
  COSET,
  COGES,
  COARM,
  COTOS,
  COTES,
  COARC
}

/*
A função eSigla transforma o objeto Sigla em array e verifica se o
parâmetro recebido está no array, retornando assim um valor booleano.
*/

function eSigla (parametro: any): boolean {
  return Object.values(Sigla).includes(parametro)
}

function eArea (parametro: any): boolean {
  return Object.values(Area).includes(parametro)
}

export const validador = {
  eSigla,
  eArea
}
