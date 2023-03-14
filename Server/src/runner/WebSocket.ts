import { Server } from "socket.io";

import lib_redis from "../modules/redis";

console.log(`🔄 [WebSocket] Starting WebSocket Server...`);

const socketRedis = lib_redis.get("socket");

const io = new Server(Number(process.env.WEBSOCKET_PORT), {
	path: "/",
	cors: {
		origin: `http://${
			process.env.NODE_ENV === "production"
				? "127.0.0.1"
				: `fakelocal.com:${process.env.DASHBOARD_PORT}`
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

socketRedis.on("message", (redisChannel: any, options: any) => {
	io.to(options.channel).emit(options.data);
});

console.log(
	`🖥️  [WebSocket] WebSocket Server ready at ws://${
		process.env.NODE_ENV === "production" ? "127.0.0.1" : "fakelocal.com"
	}:${process.env.WEBSOCKET_PORT}`
);

export default class WebSocketRunner {
	public static start() {}

	public static stop() {
		console.log("🔄 [WebSocket] Disconnecting from Socket Redis...");
		socketRedis.disconnect();
		console.log("🛑 [WebSocket] Disconnected from Socket Redis");

		console.log("🔄 [WebSocket] Stopping WebSocket Server...");
		io.close();
		console.log("🛑 [WebSocket] Stopped WebSocket Server");
	}
}
