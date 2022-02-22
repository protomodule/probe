import crypto from "crypto"
import { NextFunction, Request, Response } from "express"
import { Options, Settings } from "../utils/options"
import { encode, decode } from "../utils/base58"

export const defaults = Object.freeze({
  tracingHeader: "X-Trace-Id",
  tracingRequestHeader: "X-Request-Id",
})

export type TracingSettings = Settings<typeof defaults>
export type TracingOptions = Options<typeof defaults>

export const middleware = (options: TracingOptions) => {
  const settings = { ...defaults, ...options }
  return (req: Request, res: Response, next: NextFunction) => {
    req.requestId = encode(crypto.randomBytes(8))
    req.traceId = [req.headers[settings.tracingHeader.toLowerCase()]].filter(v => !!v).flat().join("").replace(/[^a-zA-Z0-0]+/gi, '') || encode(crypto.randomBytes(10))
    res.setHeader(settings.tracingRequestHeader, req.requestId)
    res.setHeader(settings.tracingHeader, req.traceId)
    next()
  }
}
