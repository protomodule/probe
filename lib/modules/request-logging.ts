import { Request, Response, NextFunction } from "express"
import { log as defaultLogger } from "../utils/logger"
import { Options, Settings } from "../utils/options"

export const defaults = Object.freeze({
  requestLoggingMethod: defaultLogger.verbose,
  requestLoggingWarning: defaultLogger.warning,
  requestLoggingSlowRequest: 10e3,
})

export type RequestLoggingSettings = Settings<typeof defaults>
export type ReqeustLoggingOptions = Options<typeof defaults>
type Timestamp = [number, number]
const NS_PER_SEC = 1e9
const NS_TO_MS = 1e6

const timeSince = (start: Timestamp) => {
  const diff = process.hrtime(start)
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

export const middleware = (options: ReqeustLoggingOptions) => {
  const settings: RequestLoggingSettings = {
    ...defaults,
    ...options
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime()
    
    res.on("close", () => {
      const duration = timeSince(start)
      const isSlowRequest = duration > settings.requestLoggingSlowRequest
      const logger = isSlowRequest
        ? settings.requestLoggingWarning
        : settings.requestLoggingMethod
      logger(req.method, req.originalUrl, `[${res.statusCode}]`, `${duration.toLocaleString()} ms`)
    })

    next()
  }
}
