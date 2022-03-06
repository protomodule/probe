# ⚛️ Protomodule | Documentation

## Environment variables

*Protomodule | Probe* provides a type-safe, validated way of accessing environment variables in NodeJS.

### Usage

 * Create a `config.ts` file in your project
 * Export instance of your config as a singleton module by calling `from` or `fromEnv`
 * Add environment variables to the schema
 * Import your custom singleton config in other modules as needed

_config.ts:_
```js
import { fromEnv, str } from "@protomodule/probe"

export const config = fromEnv({
  CUSTOM_VAR: str()
})
```

_your-module.ts:_
```js
import { config } from "./config.ts"

const custom = config.CUSTOM_VAR
```

### Which type-safe validators are available?

For more information on how to specify the schema for your environment variables continue reading [here](https://github.com/af/envalid).

For future compatibility *Protomodule | Probe* exports all supported validators:

```js
import { yesNo, str, bool, num, email, host, port, url, json } from "@protomodule/probe"
```

### Environment variables conventions

There are a few default variables which are required as seen as the configuration singleton is created.

 * **NODE_ENV**: Specifies in which environment your application is running. By default this variable must contain one the following values: local, development, staging, production. If you want to customize your environment read on.
 * **PORT**: Specifies the port on which express should except connections. 

If one of the required variables is missing. The application will exit with error code 519.

### Custom runtime environments

When instantiating your config singleton by calling `fromEnv(...)` default environment selector is used (local, development, staging, production).

You can provide your own enum containing your environments by instantiating the config singleton with `from(..., ...)`:

```js
import { from } from "@protomodule/probe"

enum MyEnv {
  test = "test",
  production = "production",
}

const conf = from(MyEnv, {
  OTHER: str(),
})
```

In the example above only `test` and `production` will be valid environment names.