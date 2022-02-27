import fs from "fs"
import path from "path"
import { Response, Router } from "express"
import { Options, Settings } from "../utils/options"
import { template } from "../resources/version-not-found"

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
  versionFile: "version.json",
  versionRoute: "/version",
  versionShort: "/__v",
})

export type VersionSettings = Settings<typeof defaults>
export type VersionOptions = Options<typeof defaults>

const findFile = (dir: string, filename: string): string | undefined => {
  const search = path.join(dir, filename)
  return fs.existsSync(search)
    ? search
    : path.dirname(dir) === dir ? undefined : findFile(path.dirname(dir), filename)
}

const notFound = (data: any, res: Response) => {
  if (!data) {
    const packageFile = findFile(require?.main?.filename || process.cwd(), "package.json")
    return res
      .status(404)
      .set("Content-Type", "text/html")
      .send(template(packageFile ? require(packageFile).name : "-"))
  }
}

export const router = (options: VersionOptions) => {
  const settings: VersionSettings = {
    ...defaults,
    ...options
  }

  const versionFile = findFile(require?.main?.filename || process.cwd(), settings.versionFile)
  const versionInfo: Version | undefined = versionFile && require(versionFile)

  return Router()
    .get(settings.versionRoute, (_, res) => {
      if(notFound(versionInfo, res)) return
      return res.json(versionInfo)
    })
    .get(settings.versionShort, (_, res) => {
      if(notFound(versionInfo, res)) return
      return res.send(versionInfo?.version)
    })
}
