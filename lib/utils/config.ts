import "dotenv/config"
import chalk from "chalk"
import boxen from "boxen"
import { ValidatorSpec, cleanEnv, str, port, CleanedEnvAccessors } from "envalid"
import { log, LogLevel } from "./logger"

export type Schema<T> = { [K in keyof T]: ValidatorSpec<T[K]>; }

const defaults = {
  LOG_LEVEL: str({
    choices: Object.keys(LogLevel).filter(value => isNaN(Number(value))),
    devDefault: LogLevel.verbose,
  }),
  PORT: port(),
}

const reporter = ({ errors } : { errors: Partial<Record<string, Error>> }) => {
  log.__raw("\n")
  log.__raw(boxen(
    Object.entries(errors)
      .map(([key, error]) => `${chalk.blue(key)}: ${error?.message === "undefined" ? "Missing environment variable" : error?.message}`)
      .join("\n"),
    {
      title: chalk.bgRed(` ${chalk.bold(" Invalid")} environment variables  `),
      titleAlignment: 'center',
      padding: 1,
      borderStyle: "round"
    }
  ))
  log.__raw(chalk.yellow(`\nExiting with error code 519`))
  process.exit(519)
}

export enum Env {
  local = "local",
  development = "development",
  staging = "staging",
  production = "production",
}

export const fromEnv = <T>(schema?: Schema<T>) => schema ? from(Env, schema) : fromDefault(Env)

export const fromDefault = <E>(env: E) => {
  return cleanEnv(
    process.env,
    {
      NODE_ENV: str({ choices: Object.keys(env).filter(value => isNaN(Number(value))) }),
      ...defaults
    },
    { reporter }
  )
}

type Defaults = {
  [K in keyof typeof defaults]: (typeof defaults[K] extends ValidatorSpec<infer V> ? V : never)
} & { NODE_ENV: string } & CleanedEnvAccessors

export const from = <E, T>(env: E, schema: Schema<T>): Readonly<Defaults & T> => {
  return cleanEnv(
    process.env,
    {
      ...defaults,
      ...schema
    },
    { reporter }
  ) as Readonly<Defaults & T>
}
