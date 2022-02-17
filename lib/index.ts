import { Options as OptionsFor } from "./utils/options"
import { defaults as versionDefaults, router as versionRouter, VersionSettings } from "./modules/version"

type Settings = VersionSettings & {
  useVersion: boolean
  useMetrics: boolean
}

type Options = OptionsFor<Settings>

export const withDefaults: Settings = Object.freeze({
  useVersion: true,
  useMetrics: true,
  ...versionDefaults,
})
 
export const useProtomoduleOn = (app: any, options: Options) => {
  const settings = { ...withDefaults, ...options }
  
  if (settings.useVersion) app.use(versionRouter(settings))
}