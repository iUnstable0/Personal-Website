if (process.env.NODE_ENV === "production") {
	require("module-alias/register");
}

const chalk = require("ansi-colors");

let time = Date.now();

// @ts-ignore
process.send = process.send || function () {};

require("better-logging")(console);

import WebSocket from "@/runner/WebSocket";
import Fastify from "@/runner/Fastify";
import Discord from "@/runner/Discord";
import Apollo from "@/runner/Apollo";

WebSocket.start();

Fastify.start().then(() => {
	Discord.start().then(() => {
		Apollo.start().then(() => {
			console.log(
				chalk.green(`[Init]`),
				`Server online! Took ${Date.now() - time}ms`,
			);

			process.send("ready");
		});
	});
});

process.on("SIGINT", async () => {
	time = Date.now();

	console.log(chalk.red(`[Init]`), `Stopping server...`);

	Apollo.stop().then(() => {
		Discord.stop().then(() => {
			Fastify.stop().then(() => {
				WebSocket.stop();

				console.log(
					chalk.green(`[Init]`),
					`Ready to exit! Took ${Date.now() - time}ms`,
				);

				process.exit(0);
			});
		});
	});
});
