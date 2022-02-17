import { Options as OptionsFor } from "./utils/options"
import { defaults as versionDefaults, router as versionRouter, VersionSettings } from "./modules/version"
import { defaults as changelogDefaults, router as changelogRouter, ChangelogSettings } from "./modules/changelog"

type Settings = VersionSettings & ChangelogSettings & {
  useVersion: boolean
  useChangelog: boolean
  useMetrics: boolean
}

type Options = OptionsFor<Settings>

export const withDefaults: Settings = Object.freeze({
  useVersion: true,
  useChangelog: true,
  useMetrics: true,
  ...versionDefaults,
  ...changelogDefaults,
})
 
export const useProtomoduleOn = (app: any, options: Options) => {
  const settings = { ...withDefaults, ...options }
  
  if (settings.useVersion) app.use(versionRouter(settings))
  if (settings.useChangelog) app.use(changelogRouter(settings))
}