import app from '@/principal/config/app'
import request from 'supertest'

describe('CORS middleware', () => {
  test('Deve habilitar o CORS', async () => {
    app.get('/teste_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/teste_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
