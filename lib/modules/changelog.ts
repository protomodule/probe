import fs from "fs"
import { Response, Router } from "express"
import { Options, Settings } from "../utils/options"
import { template } from "../resources/changelog-not-found"
import { findFile } from "../utils/find-file"

export const defaults = Object.freeze({
  changelog: "changelog.html",
  changelogRoute: "/changelog",
})

export type ChangelogSettings = Settings<typeof defaults>
export type ChangelogOptions = Options<typeof defaults>

const notFound = (data: any, res: Response) => {
  if (!data) {
    const packageFile = findFile(require?.main?.filename || process.cwd(), "package.json")
    return res
      .status(404)
      .set("Content-Type", "text/html")
      .send(template(packageFile ? require(packageFile).name : "-"))
  }
}

export const router = (options: ChangelogOptions) => {
  const settings: ChangelogSettings = {
    ...defaults,
    ...options
  }

  return Router()
    .get(settings.changelogRoute, (_, res) => {
      const changelogFile = findFile(require?.main?.filename || process.cwd(), settings.changelog)
      const changelogHtml = changelogFile && fs.readFileSync(changelogFile)

      if (notFound(changelogHtml, res)) return

      return res
        .set("Content-Type", "text/html")
        .send(changelogHtml)
    })
}
