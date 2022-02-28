import { init } from "./utils/init"
import { defaults as versionDefaults, router as versionRouter } from "./modules/version"
import { defaults as changelogDefaults, router as changelogRouter } from "./modules/changelog"
import { defaults as metricsDefaults, middleware as metricsMiddleware } from "./modules/metrics"
import { defaults as requestLoggingDefaults, middleware as requestLoggingMiddleware } from "./modules/request-logging"
import { defaults as tracingDefaults, middleware as tracingMiddleware } from "./modules/tracing"
import { Settings, Options } from "./settings"
import { TRUE_VALS } from "./utils/config"

export { from, Env, fromEnv, yesNo } from "./utils/config"
export { str, bool, num, email, host, port, url, json  } from "envalid"
export { log } from "./utils/logger"
export { withMetricsOnly, withoutChangelog, withoutMetrics, withoutRequestLogging, withoutConsoleLog } from "./settings"
export const withDefaults: Settings = Object.freeze({
  useVersion: true,
  useChangelog: true,
  useMetrics: true,
  useRequestLogging: true,
  useConsoleLog: true,
  useTracing: true,
  ...versionDefaults,
  ...changelogDefaults,
  ...metricsDefaults,
  ...requestLoggingDefaults,
  ...tracingDefaults,
})

export const useProtomoduleIn = (app: any, ...options: Options[]) => {
  const settings = {
    // Load Defaults and overwrite with options
    ...options.reduce<Settings>((acc, opt) => ({ ...acc, ...opt}), withDefaults),

    // Overwrite defaults/options with environment variable (when specified)
    ...(process.env.LOG_REQUESTS ? { useRequestLogging: TRUE_VALS.includes(process.env.LOG_REQUESTS) } : undefined),
    ...(process.env.LOG_TRACING ? { requestLoggingTracing: TRUE_VALS.includes(process.env.LOG_TRACING) } : undefined),
  }

  init(settings)
  
  if (settings.useTracing) app.use(tracingMiddleware(settings))
  if (settings.useVersion) app.use(versionRouter(settings))
  if (settings.useChangelog) app.use(changelogRouter(settings))
  if (settings.useRequestLogging) app.use(requestLoggingMiddleware(settings))

  // Register metrics after version and changelog to exclude them from being measured
  if (settings.useMetrics) app.use(metricsMiddleware(settings))
}
