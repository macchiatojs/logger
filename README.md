# @macchiatojs/logger

### Macchiato.js logger based on [pino](https://github.com/pinojs/pino-http).

## `Installation`

```bash
# npm
$ npm install @macchiatojs/logger
# yarn
$ yarn add @macchiatojs/logger
```

## `Usage`

This is a practical example of how to use.

with Macchiato.js - Express style;

```typescript
import Macchiato, { Request, Response } from "@macchiatojs/kernel";
import logger from "@macchiatojs/logger";

const app = new Macchiato();

app
  .use(logger());
  .use((request: Request, response: Response) => {
    response.body = "Hello World";
  });

app.start(2222);
```

with Macchiato.js - Koa style;

```typescript
import Macchiato, { Context } from "@macchiatojs/kernel";
import logger from "@macchiatojs/logger";

const app = new Macchiato();

app
  .use(logger());
  .use((context: Context) => {
    context.response.body = "Hello World";
  });

app.start(2222);
```

with raw Node.js

```typescript
import http, { IncomingMessage, ServerResponse } from "http";
import { rawLogger } from "@macchiatojs/logger";

const server = http.createServer((request, response) => {
  logger()(req, res);
  response.statusCode = 200;
  response.write("Hello World !");
  response.end();
});

server.start(2222);
```

> Note: <br/> > `rawLogger` is re-export for `pino-http` and You can learn more about `pino-http` from the official documentation [here](https://github.com/pinojs/pino-http).

#### License

---

[MIT](LICENSE) &copy; [Imed Jaberi](https://github.com/3imed-jaberi)
