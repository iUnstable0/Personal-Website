const chalk = require("ansi-colors");

let time = Date.now();

// @ts-ignore
process.send = process.send || function () {};

require("better-logging")(console);

// console.log(chalk.blue(`[Init]`), `Loading ENV from .env...`);
// require("dotenv").config({ path: ".env" });
// console.log(chalk.magenta(`[Init]`), `Loaded ENV from .env`);

// console.log(chalk.blue(`[Init]`), `Loading ENV from .env (GLOBAL)...`);
// require("dotenv").config({ path: "../.env" });
// console.log(chalk.magenta(`[Init]`), `Loaded ENV from .env (GLOBAL)`);

// console.log(
//   chalk.blue(`[Init]`),
//   `Loading ENV from .env.${process.env.NODE_ENV}...`
// );
// require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
// console.log(
//   chalk.magenta(`[Init]`),
//   `Loaded ENV from .env.${process.env.NODE_ENV}`
// );

// console.log(
//   chalk.blue(`[Init]`),
//   `Loading ENV from .env.${process.env.NODE_ENV} (GLOBAL)...`
// );
// require("dotenv").config({ path: `../.env.${process.env.NODE_ENV}` });
// console.log(
//   chalk.magenta(`[Init]`),
//   `Loaded ENV from .env.${process.env.NODE_ENV} (GLOBAL)`
// );

import Fastify from "./runner/Fastify";
import Apollo from "./runner/Apollo";
import WebSocket from "./runner/WebSocket";

WebSocket.start();

Fastify.start().then(() => {
  Apollo.start().then(() => {
    console.log(
      chalk.green(`[Init]`),
      `Server online! Took ${Date.now() - time}ms`
    );

    process.send("ready");
  });
});

process.on("SIGINT", async () => {
  time = Date.now();

  console.log(chalk.red(`[Init]`), `Stopping server...`);

  Apollo.stop().then(() => {
    Fastify.stop().then(() => {
      WebSocket.stop();

      console.log(
        chalk.green(`[Init]`),
        `Ready to exit! Took ${Date.now() - time}ms`
      );

      process.exit(0);
    });
  });
});
