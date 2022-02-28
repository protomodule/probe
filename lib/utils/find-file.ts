import fs from "fs"
import path from "path"

export const findFile = (dir: string, filename: string): string | undefined => {
  const search = path.join(dir, filename)
  return fs.existsSync(search)
    ? search
    : path.dirname(dir) === dir ? undefined : findFile(path.dirname(dir), filename)
}
