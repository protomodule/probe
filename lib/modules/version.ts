import fs from "fs"
import path from "path"
import { Router } from "express"
import { Options, Settings } from "../utils/options"

type Version = {
  version: string
  ahead: string
  commit: string
  short: string
  branch: string
  docker_tag: string
  latest_tag: string
  timestamp: string
}

export const defaults = Object.freeze({
  file: "version.json",
  route: "/version",
  routeShort: "/__v",
})

export type VersionSettings = Settings<typeof defaults>
export type VersionOptions = Options<typeof defaults>

const findVersionFile = (dir: string, filename: string): string | undefined => {
  const search = path.join(dir, filename)
  return fs.existsSync(search)
    ? search
    : path.dirname(dir) === dir ? undefined : findVersionFile(path.dirname(dir), filename)
}

export const router = (options: VersionOptions) => {
  const settings: VersionSettings = {
    ...defaults,
    ...options
  }

  const versionFile = findVersionFile(require?.main?.filename || process.cwd(), settings.file)
  const versionInfo: Version | undefined = versionFile && require(versionFile)

  return Router()
    .get(settings.route, (_, res) => res.json(versionInfo) )
    .get(settings.routeShort, (_, res) => res.send(versionInfo?.version) )
}
