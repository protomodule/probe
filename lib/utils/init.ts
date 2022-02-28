import chalk from "chalk"
import boxen from "boxen"
import { log } from "./logger"
import { Settings } from "../settings"
const version = require("../../package.json").version

export const init = (settings: Settings) => {
  process.stdout.write(Buffer.from(`\n\n< / >            P R O T O M O D U L E           v${version}\n`));
  process.stdout.write(Buffer.from(`         ${chalk.underline("https://github.com/protomodule/probe")}\n\n\n`));

  if (settings.useConsoleLog) {
    (function() {
      let used = false
      console.log = function (..._: any[]) {
        if (!used) {
          const e = new Error()
          const match = e.stack && /(\/.*):(\d+):(\d+)$/.exec(e.stack.split("\n")[2]);
          const caller = `${match && match[0]}`.replace(`${process.cwd()}/`, "")

          process.stdout.write(`\n${boxen(
            `Consider using ${chalk.green("log.verbose")} from ${chalk.green("import { log } from \"@protomodule/probe\"")}\nCheck ${chalk.underline(caller)}`,
            {
              title: chalk.bgRed(` ${chalk.bold(" console.log")} has been called directly. `),
              titleAlignment: 'center',
              padding: 1,
              borderStyle: "round"
            }
          )}\n\n\n`)
          used = true
        }

        log.verbose(...Object.values(arguments))
      }
      console.error = function (..._: any[]) {
        log.error(...Object.values(arguments))
      }
    })()
  }
}