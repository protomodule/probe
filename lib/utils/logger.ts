import chalk from "chalk"
import util from "util"
import { fromDefault } from "./config"
import { LogLevel } from "../common/log-level"

const LEVEL_PRIO: { [key in LogLevel]: number } = Object.freeze(Object.keys(LogLevel).reduce((acc, level, index) => ({ ...acc, [level]: index }), {
  [LogLevel.verbose]: 0,
  [LogLevel.debug]:   0,
  [LogLevel.info]:    0,
  [LogLevel.warning]: 0,
  [LogLevel.error]:   0,
}))

const PRETTY: { [key in LogLevel]: { color: string, icon: string } } = Object.freeze({
  [LogLevel.verbose]: { color: "#D1D1D0", icon: "⚪️" },
  [LogLevel.debug]:   { color: "#31C372", icon: "🟢" },
  [LogLevel.info]:    { color: "#32C1E9", icon: "🔵" },
  [LogLevel.warning]: { color: "#E2BD1B", icon: "🟠" },
  [LogLevel.error]:   { color: "#FF3B74", icon: "🔴" },
})

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
  LOG_PID: boolean
}

export class Log implements Logger {
  private config: LogConfigEnv
  private logLevel: LogLevel

  constructor(config: LogConfigEnv) {
    this.config = config
    this.logLevel = LogLevel.verbose

    try { this.logLevel = LogLevel[config.LOG_LEVEL as keyof typeof LogLevel] }
    catch (e) {
      this.logLevel = LogLevel.verbose
      this.warning(`Given LOG_LEVEL is invalid - using fallback ${chalk.bold.hex(PRETTY[this.logLevel].color)(this.logLevel)}. Valid options are ${Object.keys(LogLevel).map(level => chalk.bold.hex(PRETTY[level as keyof typeof LogLevel].color)(level)).join(", ")}`)
    }
  }

  private callerFile = (): string | undefined => {
    if (!this.config.LOG_CALLER) return undefined

    const e = new Error()
    const consoleLog = e.stack && /((\/.*):(\d+):(\d+))\)?$/.exec(e.stack.split("\n")[5]);
    const match = consoleLog || e.stack && /((\/.*):(\d+):(\d+))\)?$/.exec(e.stack.split("\n")[4]);
    return `${match && match[1]}`.replace(`${process.cwd()}/`, "")
  }

  private log = (level: LogLevel, ...args: any[]) => {
    if (LEVEL_PRIO[level] < LEVEL_PRIO[this.logLevel]) return this 

    const prefixes = [
      !!this.config.LOG_TIMESTAMP && `[${new Date().toISOString().substring(11, 23)}]`,
      PRETTY[level].icon,
      !!this.config.LOG_PID && `(${process.pid})`,
      this.callerFile(),
      chalk.hex(PRETTY[level].color)(LogLevel[level].toUpperCase())
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
