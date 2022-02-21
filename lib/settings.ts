import { Options as OptionsFor } from "./utils/options"
import { VersionSettings } from "./modules/version"
import { ChangelogSettings } from "./modules/changelog"
import { MetricsSettings } from "./modules/metrics"
import { RequestLoggingSettings } from "./modules/request-logging"

export type Settings =
  VersionSettings &
  ChangelogSettings &
  MetricsSettings &
  RequestLoggingSettings &
  {
    useVersion: boolean
    useChangelog: boolean
    useMetrics: boolean
    useRequestLogging: boolean
    useConsoleLog: boolean
  }

export type Options = OptionsFor<Settings>

export const withMetricsOnly: Options = Object.freeze({
  useVersion: false,
  useChangelog: false,
  useMetrics: true,
  useRequestLogging: false,
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
