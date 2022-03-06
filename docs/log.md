# ⚛️ Protomodule | Documentation

## Log

An optinionated *Protomodule | Probe* best practice is NOT to use `console.log` directly. This polutes the stdout without the posibility to disable logging.

The logger implemented in *Protomodule | Probe* provide common log leves which can be disabled via environment variables.

### Usage

```js
import { log } from "@protomodule/probe"

log.debug("Your message goes here")
```

### Log levels

Available log levels are:

  * `verbose`
  * `debug`
  * `info`
  * `warning`
  * `error`

By default `verbose` is selected as the output log level. By setting the environment variable `LOG_LEVEL` to any other log level only the selected an higher log levels are written to stdout.

**Example:** If `LOG_LEVEL=warning` only calls to `log.warning(...)` and `log.error(...)` will be written to stdout reducing the overall log output size.

### console.log

If you initialize your app by calling `useProtomoduleIn` *Protomodule | Probe* will overwrite `console.log`. When you use `console.log` in your code for the first time a warning will be displayed and the output is redirected to `log.verbose(...)` in order to be able silence `console.log` output via log levels.

If you want to disable the capturing of `console.log` specify it as an option to the `useProtomoduleIn` call:

```js
import { useProtomoduleIn, withoutConsoleLog } from "@protomodule/probe"

...
useProtomoduleIn(app, withoutConsoleLog)
```

### Automatic object inspection

When handing an object or `undefined` type to any log method *Protomodule | Probe* performs an object inspection automatically. This is indicated by "--- Inspection ---" in the output. This gives you a formatted and colorized output.