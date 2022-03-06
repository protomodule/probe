# ⚛️ Protomodule | Documentation

## Predefined options

The following options can be imported from `import { ... } from "@protomodule/probe"`.

 * `withMetricsOnly`: Disables all modules except Prometheus compatible metrics endpoint for express.
 * `withoutMetrics`: Disables metrics collection & endpoint.
 * `withoutChangelog`: Disables changelog endpoint.
 * `withoutRequestLogging`: Disables request logging to *stdout*.
 * `withoutConsoleLog`: Disable overwriting of *console.log* function.

These are only predefined sets of options. You can pass in plain objects with configuration values for each module. See type completion for more details about available options.

## Usage

To initialize *Protomodule | Probe* without request logging and without overwriting `console.log` and exposing metrics on a custom endpoint use this initialization:

```js
import { useProtomoduleIn, withoutRequestLogging, withoutConsoleLog } from "@protomodule/probe"

const app = express()
useProtomoduleIn(app,
  withoutRequestLogging,
  withoutConsoleLog,
  { metricsRoute: "/my_metrics" }
)
```
