import { ControladorDeEstacoes } from './estacoes'

describe('Controlador de estações', () => {
  test('Deve retornar todas as estações se um parâmetro não for fornecido', () => {
    const sut = new ControladorDeEstacoes()
    const requisicaoHttp = ''
    const respostaHttp = sut.tratar(requisicaoHttp)
    expect(respostaHttp.codigoDeStatus).toBe(200)
    expect(respostaHttp.corpo).toEqual({
      Estação: 'Todas as estações'
    })
  })
})
