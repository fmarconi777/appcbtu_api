import app from '@/principal/config/app'
import request from 'supertest'

describe('Transforma corpo middleware', () => {
  test('Deve transformar o corpo da requisicao do formato json para objeto', async () => {
    app.post('/teste_transforma_corpo', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/teste_transforma_corpo')
      .send({ nome: 'Felipe' })
      .expect({ nome: 'Felipe' })
  })
})
