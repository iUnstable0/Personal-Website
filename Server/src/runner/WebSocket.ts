const chalk = require("ansi-colors");

import { Server } from "socket.io";

import lib_redis from "@iunstable0/server-libs/build/redis";

console.log(chalk.blue(`[WebSocket]`), `Starting WebSocket Server...`);

const redis = lib_redis.get(true);

const io = new Server(Number(process.env.WEBSOCKET_PORT), {
  path: "/",
  cors: {
    origin: `http://${
      process.env.NODE_ENV === "production"
        ? "127.0.0.1"
        : `fakelocal.com:${process.env.WEBSITE_PORT}`
    }`,
  },
});

io.on("connection", (socket) => {
  const { channel } = socket.handshake.auth;

  if (!channel) {
    socket.disconnect();

    return;
  }

  socket.join(channel);
});

// socketRedis.subscribe("userUpdate");
// socketRedis.subscribe("executionResult");

redis.on("message", (redisChannel: any, options: any) => {
  options = JSON.parse(options);

  io.to(options.channel).emit(options.data);
});

console.log(
  chalk.magenta(`[WebSocket]`),
  `WebSocket Server ready at ws://${
    process.env.NODE_ENV === "production" ? "127.0.0.1" : "fakelocal.com"
  }:${process.env.WEBSOCKET_PORT}`
);

export default class WebSocketRunner {
  public static start() {}

  public static stop() {
    console.log(chalk.blue(`[WebSocket]`), `Disconnecting from Redis...`);
    redis.disconnect();
    console.log(chalk.magenta(`[WebSocket]`), `Disconnected from Redis`);

    console.log(chalk.blue(`[WebSocket]`), `Stopping WebSocket Server...`);
    io.close();
    console.log(chalk.magenta(`[WebSocket]`), `Stopped WebSocket Server`);
  }
}
