import { init } from "./utils/init"
import { defaults as versionDefaults, router as versionRouter } from "./modules/version"
import { defaults as changelogDefaults, router as changelogRouter } from "./modules/changelog"
import { defaults as metricsDefaults, middleware as metricsMiddleware } from "./modules/metrics"
import { defaults as requestLoggingDefaults, middleware as requestLoggingMiddleware } from "./modules/request-logging"
import { Settings, Options } from "./settings"

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
  ...versionDefaults,
  ...changelogDefaults,
  ...metricsDefaults,
  ...requestLoggingDefaults,
})
 
export const useProtomoduleIn = (app: any, ...options: Options[]) => {
  const settings = options.reduce<Settings>((acc, opt) => ({ ...acc, ...opt}), withDefaults)

  init(settings)
  
  if (settings.useVersion) app.use(versionRouter(settings))
  if (settings.useChangelog) app.use(changelogRouter(settings))
  if (settings.useRequestLogging) app.use(requestLoggingMiddleware(settings))

  // Register metrics after version and changelog to exclude them from being measured
  if (settings.useMetrics) app.use(metricsMiddleware(settings))
}
