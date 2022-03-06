# ⚛️ Protomodule | Probe
**for NodeJS / Express based applications**

*Protomodule* is a set of common practices which span from coding over CI/CD to production deployments. Every utility within Protomodule is able to provide core functionality as a standalone tool. All Protomodule utilities are interoperable to get the most out of your DevOps pipeline with minimum effort.

*Probe* is the NodeJS module to integrate Protomodules principles into [NodeJS](https://nodejs.org/en/) / [Express](http://expressjs.com) based applications.

## Quick start guide

Install *Protomodule | Probe* by running:

```
$ npm install --save @protomodule/probe
```

Integrate *Protomodule | Probe* into your express setup with a single line of code:

**⚠️ Be aware: Add Protomodule | Probe before you add all your other routes/middlewares in order to function correctly. All routes/middlewares added before calling the Protomodule initializer are exluded from protomodules features.**

```
import { useProtomoduleIn } from "@protomodule/probe"

const app = express()
useProtomoduleIn(app)

// Add your routes here
```

## Features

*Protomodule | Probe* provides two kinds of features:

### Modules
 
Modules are automatically applied middlewares for express. The may be deactivated by configuration.

 * [Version](docs/version.md)
 * [Changelog](docs/changelog.md)
 * [Metrics](docs/metrics.md)
 * [Request Logging](docs/request-logging.md)
 * [Request Tracing](docs/tracing.md)
 
### Utilities

Must be explicitly used.

 * [Environment variables](docs/config.md)
 * [Logging](docs/log.md)

## Configuration

Modules can be configured in the `useProtomoduleIn(...)` call. First parameter of this function takes an Express app. Through the [**rest** arguments](https://www.typescriptlang.org/docs/handbook/type-compatibility.html#optional-parameters-and-rest-parameters) an arbitrary number of options can be specified.

You can pass in plain objects or use predefined options imported from `@protomodule/probe`.

Be aware that all options are merged in the following priority:

 1. Specific environment variables overwrite
 1. Options as parameters (parameters are merged from first to last)
 1. Default fallback values

## Credits

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file.

> This project is in no way affiliated with Apple Inc or Google Inc. This project is open source under the MIT license, which means you have full access to the source code and can modify it to fit your own needs.
