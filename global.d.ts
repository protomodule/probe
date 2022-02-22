declare namespace Express {
  export interface Request {
    requestId?: string
    traceId?: string
  }
}