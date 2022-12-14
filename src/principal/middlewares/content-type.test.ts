import app from '@/principal/config/app'
import request from 'supertest'

describe('Content type middleware', () => {
  test('Deve retornar por padrão o content-type como json', async () => {
    app.get('/teste_content_type', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/teste_content_type')
      .expect('content-type', /json/)
  })
})
