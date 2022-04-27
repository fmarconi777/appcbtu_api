import request from 'supertest'
import app from '../config/app'

describe('Transforma corpo middleware', () => {
  test('Deve transformar o corpo da resposta para o formato json', async () => {
    app.post('/teste_transforma_corpo', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/teste_transforma_corpo')
      .send({ nome: 'Felipe' })
      .expect({ nome: 'Felipe' })
  })
})
