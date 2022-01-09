/*!
 * @macchiatojs/logger
 *
 *
 * Copyright(c) 2021 Imed Jaberi
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 */

import pinoHttp from 'pino-http'
import type { Options } from 'pino-http'
import type { MacchiatoHandler, Context, Request, Response, Next } from '@macchiatojs/kernel'

/**
 * @types
 */

interface MacchiatoLoggerDestinationStream {
  write(msg: string): void
}

interface MacchiatoLoggerOptions extends Options {
  expressify?: boolean
}

/**
 * Macchiato.js logger based on pino.
 * @see https://github.com/pinojs/koa-pino-logger/blob/master/logger.js
 * 
 * @api public
 */

function logger(opts?: MacchiatoLoggerOptions, stream?: MacchiatoLoggerDestinationStream): MacchiatoHandler {
  const expressify = opts?.expressify ?? true
  delete opts?.expressify
 
  const wrap = pinoHttp(opts, stream)

  const pino = (ctx: Context, next: Next) => {
    wrap(ctx.request.raw, ctx.response.raw)
    ctx['log'] = ctx.request['log'] = ctx.response['log'] = ctx.request.raw['log']

    return next().catch((error) => {
      // this behave already tested in the kernel
      /* istanbul ignore next */
      ctx['log'].error({ error })
      /* istanbul ignore next */
      throw error
    })
  }

  const middleware = expressify
    ? (request: Request, response: Response, next: Next) =>
        pino({ request, response } as Context, next)
    : pino

  middleware['logger'] = wrap.logger

  return middleware
}

/**
 * Expose
 */

export { logger as default, logger, pinoHttp, pinoHttp as rawLogger }
