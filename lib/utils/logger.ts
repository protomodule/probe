import chalk from "chalk"
import util from "util"
import { fromDefault } from "./config"
import { LogLevel } from "../common/log-level"

const Pretty: { [key in LogLevel]: { color: string, icon: string } } = {
  [LogLevel.verbose]: { color: "#D1D1D0", icon: "⚪️" },
  [LogLevel.debug]:   { color: "#31C372", icon: "🟢" },
  [LogLevel.info]:    { color: "#32C1E9", icon: "🔵" },
  [LogLevel.warning]: { color: "#E2BD1B", icon: "🟠" },
  [LogLevel.error]:   { color: "#FF3B74", icon: "🔴" },
}

export interface Logger {
  verbose(...args: any[]): Logger
  debug(...args: any[]): Logger
  info(...args: any[]): Logger
  warning(...args: any[]): Logger
  error(...args: any[]): Logger
}

interface LogConfigEnv {
  LOG_LEVEL: string
  LOG_CALLER: boolean
  LOG_TIMESTAMP: boolean
}

export class Log implements Logger {
  private config: LogConfigEnv

  constructor(config: LogConfigEnv) {
    this.config = config
  }

  private callerFile = (): string | undefined => {
    if (!this.config.LOG_CALLER) return undefined

    const e = new Error()
    const consoleLog = e.stack && /((\/.*):(\d+):(\d+))\)?$/.exec(e.stack.split("\n")[5]);
    const match = consoleLog || e.stack && /((\/.*):(\d+):(\d+))\)?$/.exec(e.stack.split("\n")[4]);
    return `${match && match[1]}`.replace(`${process.cwd()}/`, "")
  }

  private log = (level: LogLevel, ...args: any[]) => {
    const prefixes = [
      !!this.config.LOG_TIMESTAMP && `[${new Date().toISOString().substring(11, 23)}]`,
      Pretty[level].icon,
      this.callerFile(),
      chalk.hex(Pretty[level].color)(LogLevel[level].toUpperCase())
    ]

    process.stdout.write(`${prefixes.filter(p => !!p).join(" ")} `)
    process.stdout.write(args
      .map(arg => {
        switch (typeof arg) {
          case "string":
          case "number":
            return arg;
          case "undefined":
            return `${util.inspect(arg, { showHidden: true, depth: null, colors: true })}`
        }
        return `--- Inspection ---\n${util.inspect(arg, { showHidden: true, depth: null, colors: true })}`
      })
      .join(" ")
    )
    process.stdout.write("\n")
    return this
  }

  verbose = (...args: any[]) => {
    return this.log(LogLevel.verbose, ...args)
  }

  debug = (...args: any[]) => {
    return this.log(LogLevel.debug, ...args)
  }

  info = (...args: any[]) => {
    return this.log(LogLevel.info, ...args)
  }

  warning = (...args: any[]) => {
    return this.log(LogLevel.warning, ...args)
  }

  error = (...args: any[]) => {
    return this.log(LogLevel.error, ...args)
  }

  __raw = (...args: any[]) => {
    process.stdout.write(args
      .map(arg => `${arg}`)
      .join(" ")
    )
    process.stdout.write("\n")
  }
}

export const log = new Log(fromDefault(process.env, false))
