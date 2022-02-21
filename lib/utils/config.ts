import "dotenv/config"
import chalk from "chalk"
import boxen from "boxen"
import { ValidatorSpec, cleanEnv, str, num } from "envalid"
import { log, LogLevel } from "./logger"

export { str } from "envalid"
export type Schema<T> = { [K in keyof T]: ValidatorSpec<T[K]>; }

const defaults = {
  LOG_LEVEL: str({
    choices: Object.keys(LogLevel).filter(value => isNaN(Number(value))),
    devDefault: LogLevel.verbose,
  }),
}

export enum Env {
  local = "local",
  development = "development",
  staging = "staging",
  production = "production",
}

export const fromEnv = <T>(schema?: Schema<T>) => {
  return from(Env, schema)
}

export const from = <E, T>(env: E, schema?: Schema<T>) => {
  return cleanEnv(
    process.env,
    {
      NODE_ENV: str({ choices: Object.keys(env).filter(value => isNaN(Number(value))) }),
      ...defaults,
      ...schema
    },
    {
      reporter: ({ errors }) => {
        log.__raw("\n")
        log.__raw(boxen(
          Object.entries(errors)
            .map(([key, error]) => `${chalk.blue(key)}: ${error?.message === "undefined" ? "Missing environment variable" : error?.message}`)
            .join("\n"),
          {
            title: chalk.bgRed(` ${chalk.bold(" Invalid")} environment variables `),
            titleAlignment: 'center',
            padding: 1,
            borderStyle: "round"
          }
        ))
        log.__raw(chalk.yellow(`\nExiting with error code 519`))
        process.exit(519)
      }
    }
  )
}
