# ⚛️ Protomodule - Probe
**for nodejs**

Web browsers give away a lot of information that might seem irrelevant but can be used to create a fingerprint to identify people with a certain degree of accuracy.

## Usage

### Environment variables

 * Create a `config.ts` file in your project
 * Export instance of your config as a singleton module by calling `from` or `fromEnv`
 * Add environment variables to the schema
 * Import your custom config in every other module you need to

```
import { fromEnv, str } from "./utils/config"

export const config = fromEnv({
  CUSTOM_VAR: str()
})
```

In any other module you can import the singleton config:

```
import { config } from "./config"

const customVar: string = config.CUSTOM_VAR
```

## Credits

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file.

> This project is in no way affiliated with Apple Inc or Google Inc. This project is open source under the MIT license, which means you have full access to the source code and can modify it to fit your own needs.
