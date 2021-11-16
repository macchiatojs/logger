import request from 'supertest'
import { expect } from 'chai'

import Kernel from '@macchiatojs/kernel'
import type { Context } from '@macchiatojs/kernel'

import { logger } from '../src'

describe('koaify-logger', () => {
  const loggerMethod = ['fatal', 'error', 'warn', 'info', 'debug', 'trace']
  let app: Kernel

  beforeEach(() => {
    app = new Kernel({ expressify: false })
  })

  it('should exist log method on ctx, request and response', async () => {
    app
      .use(logger({ expressify: false }))
      .use((ctx: Context) => {
        expect(typeof ctx['log'] === 'object').to.be.true
        expect(typeof ctx.response['log'] === 'object').to.be.true
        expect(typeof ctx.request['log'] === 'object').to.be.true

        for (const method of loggerMethod) {
          expect(typeof ctx['log'][method] === 'function').to.be.true
          expect(typeof ctx.response['log'][method] === 'function').to.be.true
          expect(typeof ctx.request['log'][method] === 'function').to.be.true
        }

        ctx.response.send(200, 'imed')
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
      .use((ctx: Context) => {
        ctx.response.body = 'imed'
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
