import { Options as OptionsFor } from "./utils/options"
import { VersionSettings } from "./modules/version"
import { ChangelogSettings } from "./modules/changelog"
import { MetricsSettings } from "./modules/metrics"
import { RequestLoggingSettings } from "./modules/request-logging"
import { TracingSettings } from "./modules/tracing"

export type Settings =
  VersionSettings &
  ChangelogSettings &
  MetricsSettings &
  RequestLoggingSettings &
  TracingSettings &
  {
    useVersion: boolean
    useChangelog: boolean
    useMetrics: boolean
    useRequestLogging: boolean
    useConsoleLog: boolean
    useTracing: boolean
  }

export type Options = OptionsFor<Settings>

export const withMetricsOnly: Options = Object.freeze({
  useVersion: false,
  useChangelog: false,
  useMetrics: true,
  useRequestLogging: false,
  useTracing: false,
})

export const withoutMetrics: Options = Object.freeze({
  useMetrics: false,
})

export const withoutChangelog: Options = Object.freeze({
  useChangelog: false,
})

export const withoutRequestLogging: Options = Object.freeze({
  useRequestLogging: false,
})

export const withoutConsoleLog: Options = Object.freeze({
  useConsoleLog: false,
})

export const withoutTracing: Options = Object.freeze({
  useTracing: false,
})
