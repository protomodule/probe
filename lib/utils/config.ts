import "dotenv/config"
import chalk from "chalk"
import boxen from "boxen"
import { ValidatorSpec, cleanEnv, str, port, CleanedEnvAccessors, makeValidator, bool } from "envalid"
import { LogLevel } from "../common/log-level"

export const yesNo = makeValidator(x => {
  switch (`${x}`) {
    case "yes":
    case "y":
    case "1":
    case "true":
    case "t":
      return true
    
    case "no":
    case "n":
    case "0":
    case "false":
    case "f":
      return false
  }
  throw new Error(`Input "${x}" invalid. Expected value of "yes" | "y" | "1" | "true" | "t" or "no" | "n" | "0" | "false" | "f"`)
})

export type Schema<T> = { [K in keyof T]: ValidatorSpec<T[K]>; }

const defaults = {
  LOG_LEVEL: str({
    choices: Object.keys(LogLevel).filter(value => isNaN(Number(value))),
    devDefault: LogLevel.verbose,
  }),
  LOG_REQUESTS: yesNo({ default: false }),
  LOG_CALLER: yesNo({ default: false }),
  LOG_TIMESTAMP: yesNo({ default: false }),
  PORT: port(),
}

const reporter = ({ errors } : { errors: Partial<Record<string, Error>> }) => {
  if (!errors || Object.keys(errors).length < 1) return

  console.error("Fatal misconfiguration in environment variables\n\n\n" + boxen(
    Object.entries(errors)
      .map(([key, error]) => `${chalk.blue(key)}: ${error?.message === "undefined" ? "Missing environment variable" : error?.message}`)
      .join("\n"),
    {
      title: chalk.bgRed(` ${chalk.bold(" Invalid")} environment variables  `),
      titleAlignment: 'center',
      padding: 1,
      borderStyle: "round"
    }
  ) + chalk.yellow(`\n\n\nExiting with error code 519`))
  process.exit(519)
}

export enum Env {
  local = "local",
  development = "development",
  staging = "staging",
  production = "production",
}

export const fromEnv = <T>(schema?: Schema<T>): Readonly<Defaults & T> => schema ? from(Env, schema) : fromDefault(Env) as Readonly<Defaults & T>

export const fromDefault = <E>(env: E, reportError = true) => {
  return cleanEnv(
    process.env,
    {
      NODE_ENV: str({ choices: Object.keys(env).filter(value => isNaN(Number(value))) }),
      ...defaults
    },
    { reporter: reportError ? reporter : () => {} }
  )
}

export type Defaults = {
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
