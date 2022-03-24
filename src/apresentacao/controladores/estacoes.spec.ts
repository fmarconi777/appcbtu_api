import { ControladorDeEstacoes } from './estacoes'

describe('Controlador de estações', () => {
  test('Deve retornar um erro 400 se um parâmetro não for fornecido', () => {
    const sut = new ControladorDeEstacoes()
    const requisicaoHttp = ''
    const respostaHttp = sut.tratar(requisicaoHttp)
    expect(respostaHttp.codigoDeStatus).toBe(400)
    expect(respostaHttp.corpo).toEqual(new Error('Falta parametro: todos ou id'))
  })
})
