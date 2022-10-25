import "dotenv/config"
import chalk from "chalk"
import boxen from "boxen"
import { ValidatorSpec, cleanEnv, str, port, CleanedEnvAccessors, makeValidator, bool } from "envalid"
import { LogLevel } from "../common/log-level"

export const TRUE_VALS = ["yes", "y", "true", "t", "1"]
export const FALSE_VALS = ["no", "n", "false", "f", "0"]

export const yesNo = makeValidator(x => {
  const input = `${x}`
  if (TRUE_VALS.includes(input)) return true
  if (FALSE_VALS.includes(input)) return false
  throw new Error(`Input "${input}" invalid. Expected value of ${TRUE_VALS.join(" | ")} or ${FALSE_VALS.join(" | ")}`)
})

export type Schema<T> = { [K in keyof T]: ValidatorSpec<T[K]>; }

const defaults = {
  // Globally required
  PORT: port(),

  // Use directly in logger
  LOG_LEVEL: str({
    choices: Object.keys(LogLevel).filter(value => isNaN(Number(value))),
    devDefault: LogLevel.verbose,
  }),
  LOG_CALLER: yesNo({ default: false }),
  LOG_TIMESTAMP: yesNo({ default: false }),
  LOG_PID: yesNo({ default: false }),

  // Use in request logger
  LOG_REQUESTS: yesNo({ default: false }),
  LOG_TRACING: yesNo({ default: true }),
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
  test = "test",
  development = "development",
  staging = "staging",
  production = "production",
}

export const fromEnv = <T>(schema?: Schema<T>): Readonly<Defaults & T> => schema ? from(Env, schema) : fromDefault(Env) as Readonly<Defaults & T>

export const fromDefault = <E extends {}>(env: E, reportError = true) => {
  return cleanEnv(
    process.env,
    {
      NODE_ENV: str({ choices: Object.keys(env).filter(value => isNaN(Number(value))) }),
      ...defaults
    },
    { reporter: reportError ? reporter : () => undefined }
  )
}

export type Defaults = {
  [K in keyof typeof defaults]: (typeof defaults[K] extends ValidatorSpec<infer V> ? V : never)
} & { NODE_ENV: string } & CleanedEnvAccessors

export const from = <E extends {}, T>(env: E, schema: Schema<T>): Readonly<Defaults & T> => {
  return cleanEnv(
    process.env,
    {
      NODE_ENV: str({ choices: Object.keys(env).filter(value => isNaN(Number(value))) }),
      ...defaults,
      ...schema
    },
    { reporter }
  ) as Readonly<Defaults & T>
}
