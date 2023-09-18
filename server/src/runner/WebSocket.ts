import { Server } from "socket.io";

import lib_redis from "@iunstable0/server-libs/build/redis";

const redis = lib_redis.get(true);

let io: any;

export default class WebSocketRunner {
	public static async start(chalk: any) {
		// const chalk = await import("chalk").then((module) => module.default);

		console.log(chalk.blue(`[WebSocket]`), `Starting WebSocket Server...`);

		io = new Server(Number(process.env.WEBSOCKET_PORT), {
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

		redis.on("message", (redisChannel: any, options: any) => {
			options = JSON.parse(options);

			io.to(options.channel).emit(options.data);
		});

		console.log(
			chalk.magenta(`[WebSocket]`),
			`WebSocket Server ready at ws://${
				process.env.NODE_ENV === "production" ? "127.0.0.1" : "fakelocal.com"
			}:${process.env.WEBSOCKET_PORT}`,
		);
	}

	public static async stop(chalk: any) {
		console.log(chalk.blue(`[WebSocket]`), `Disconnecting from Redis...`);
		redis.disconnect();
		console.log(chalk.magenta(`[WebSocket]`), `Disconnected from Redis`);

		console.log(chalk.blue(`[WebSocket]`), `Stopping WebSocket Server...`);
		io.close();
		console.log(chalk.magenta(`[WebSocket]`), `Stopped WebSocket Server`);
	}
}
