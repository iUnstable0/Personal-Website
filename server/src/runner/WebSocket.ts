import { Server, Socket } from "socket.io";

import lib_redis from "@iunstable0/server-libs/build/redis";

const redis = lib_redis.get(true); // Ignore pool since pub/sub can't be used with cache store

let io: any;
let chalk: any;

export default class WebSocketRunner {
	public static async start(chalkModule: any) {
		chalk = chalkModule;
		// const chalk = await import("chalk").then((module) => module.default);

		console.log(chalk.blue(`[WebSocket]`), `Starting WebSocket Server...`);

		io = new Server(Number(process.env.WEBSOCKET_PORT), {
			path: "/",
			cors: {
				origin: `http://${
					process.env.NODE_ENV !== "development"
						? "127.0.0.1"
						: `fakelocal.com:${process.env.WEBSITE_PORT}`
				}`,
			},
		});

		io.on("connection", (socket: Socket) => {
			const { channel } = socket.handshake.auth;

			if (!channel) {
				socket.disconnect();

				return;
			}

			socket.join(channel);
		});

		redis.subscribe("socket.io");

		redis.on("message", (redisChannel: string, options: string) => {
			const { channel, data } = JSON.parse(options);

			io.to(channel).emit(data);
		});

		console.log(
			chalk.magenta(`[WebSocket]`),
			`WebSocket Server ready at ws://${
				process.env.NODE_ENV !== "development" ? "127.0.0.1" : "fakelocal.com"
			}:${process.env.WEBSOCKET_PORT}`,
		);
	}

	public static getIO() {
		return io;
	}

	public static async stop() {
		// console.log(chalk.blue(`[WebSocket]`), `Stopping cronjob...`);
		// await job.stop();
		// console.log(chalk.magenta(`[WebSocket]`), `Stopped cronjob`);

		console.log(chalk.blue(`[WebSocket]`), `Disconnecting from Redis...`);
		await redis.disconnect();
		console.log(chalk.magenta(`[WebSocket]`), `Disconnected from Redis`);

		console.log(chalk.blue(`[WebSocket]`), `Stopping WebSocket Server...`);
		await io.close();
		console.log(chalk.magenta(`[WebSocket]`), `Stopped WebSocket Server`);
	}
}
