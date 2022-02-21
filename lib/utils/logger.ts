import chalk from "chalk"
import util from "util"

export enum LogLevel {
  verbose = "verbose",
  debug = "debug",
  info = "info",
  warning = "warning",
  error = "error",
}

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

export class Log implements Logger {
  private log = (level: LogLevel, ...args: any[]) => {
    const e = new Error()
    const match = e.stack && /\((.*):(\d+):(\d+)\)$/.exec(e.stack.split("\n")[3]);
    const caller = `${match && match[0]}`.slice(1,-1).replace(`${process.cwd()}/`, "")

    process.stdout.write(`[${new Date().toISOString().substring(11, 23)}] ${Pretty[level].icon} ${caller} ${chalk.hex(Pretty[level].color)(LogLevel[level].toUpperCase())} `)
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

export const log = new Log()
