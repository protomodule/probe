import fs from "fs"
import path from "path"
import { Router } from "express"
import { Options, Settings } from "../utils/options"

export const defaults = Object.freeze({
  changelog: "changelog.html",
  changelogRoute: "/changelog",
})

export type ChangelogSettings = Settings<typeof defaults>
export type ChangelogOptions = Options<typeof defaults>

const findChangelogFile = (dir: string, filename: string): string | undefined => {
  const search = path.join(dir, filename)
  return fs.existsSync(search)
    ? search
    : path.dirname(dir) === dir ? undefined : findChangelogFile(path.dirname(dir), filename)
}

export const router = (options: ChangelogOptions) => {
  const settings: ChangelogSettings = {
    ...defaults,
    ...options
  }

  const changelogFile = findChangelogFile(require?.main?.filename || process.cwd(), settings.changelog)
  const changelogHtml = changelogFile && fs.readFileSync(changelogFile)

  return Router()
    .get(settings.changelogRoute, (_, res) => res
      .set("Content-Type", "text/html")
      .send(changelogHtml)
    )
}
