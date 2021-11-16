import request from 'supertest'
import { expect } from 'chai'

import Kernel from '@macchiatojs/kernel'
import type { Response, Request } from '@macchiatojs/kernel'

import { logger } from '../src'

describe('expressify-logger', () => {
  const loggerMethod = ['fatal', 'error', 'warn', 'info', 'debug', 'trace']
  let app: Kernel

  beforeEach(() => {
    app = new Kernel()
  })

  it('should exist log method on ctx, request and response', async () => {
    app
      .use(logger())
      .use((request: Request, response: Response) => {
        expect(typeof response['log'] === 'object').to.be.true
        expect(typeof request['log'] === 'object').to.be.true

        for (const method of loggerMethod) {
          expect(typeof response['log'][method] === 'function').to.be.true
          expect(typeof request['log'][method] === 'function').to.be.true
        }

        response.send(200, 'imed')
      })

    await request(app.start())
      .get('/')
      .expect(200, 'imed')
  })

  it('should exposes the internal pino', () => {
    const pinoLogger = logger()
    expect(typeof pinoLogger['logger'] === 'object').to.be.true

    for (const method of loggerMethod) {
      expect(typeof pinoLogger['logger'][method] === 'function').to.be.true
    }
  })

  it('should supports errors', async () => {
    app
      .use((request: Request, response: Response) => {
        response.body = 'imed'
        throw new Error('boom!')
      })

    app.on('error', err => {
      expect(err !== null).to.be.true        
    })
  
    await request(app.start())
      .get('/error')
      .expect(500, /boom/)
  })
})
