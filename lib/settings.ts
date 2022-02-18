import { Options as OptionsFor } from "./utils/options"
import { VersionSettings } from "./modules/version"
import { ChangelogSettings } from "./modules/changelog"
import { MetricsSettings } from "./modules/metrics"

export type Settings = VersionSettings & ChangelogSettings & MetricsSettings & {
  useVersion: boolean
  useChangelog: boolean
  useMetrics: boolean
}

export type Options = OptionsFor<Settings>

export const withMetricsOnly: Options = Object.freeze({
  useVersion: false,
  useChangelog: false,
  useMetrics: true,
})

export const withoutMetrics: Options = Object.freeze({
  useMetrics: false,
})

export const withoutChangelog: Options = Object.freeze({
  useChangelog: false,
})
