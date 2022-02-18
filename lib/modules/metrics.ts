import promBundle from "express-prom-bundle"
import { Options, Settings } from "../utils/options"

export const defaults = Object.freeze({
  metricsRoute: "/metrics",
})

export type MetricsSettings = Settings<typeof defaults>
export type MetricsOptions = Options<typeof defaults>

export const middleware = (options: MetricsOptions) => {
  const settings: MetricsSettings = {
    ...defaults,
    ...options
  }

  return promBundle({
    metricsPath: settings.metricsRoute,
    promClient: {
      collectDefaultMetrics: {
      }
    }
  })
}
