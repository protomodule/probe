import { defaults as versionDefaults, router as versionRouter } from "./modules/version"
import { defaults as changelogDefaults, router as changelogRouter } from "./modules/changelog"
import { defaults as metricsDefaults, middleware as metricsMiddleware } from "./modules/metrics"
import { Settings, Options } from "./settings"

export { withMetricsOnly, withoutChangelog, withoutMetrics } from "./settings"
export const withDefaults: Settings = Object.freeze({
  useVersion: true,
  useChangelog: true,
  useMetrics: true,
  ...versionDefaults,
  ...changelogDefaults,
  ...metricsDefaults,
})
 
export const useProtomoduleOn = (app: any, options?: Options) => {
  const settings = { ...withDefaults, ...options }
  
  if (settings.useVersion) app.use(versionRouter(settings))
  if (settings.useChangelog) app.use(changelogRouter(settings))

  // Register metrics after version and changelog to exclude them from being measured
  if (settings.useMetrics) app.use(metricsMiddleware(settings))
}