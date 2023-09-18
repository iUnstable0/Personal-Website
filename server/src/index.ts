if (process.env.NODE_ENV === "production") {
	require("module-alias/register");
}

let time = Date.now();

// @ts-ignore
process.send = process.send || function () {};

require("better-logging")(console);

import WebSocket from "@/runner/WebSocket";
import Fastify from "@/runner/Fastify";
import Discord from "@/runner/Discord";
import Apollo from "@/runner/Apollo";

(async () => {
	const chalk = await import("chalk").then((module) => module.default);

	WebSocket.start(chalk);

	Fastify.start(chalk).then(() => {
		Discord.start(chalk).then(() => {
			Apollo.start(chalk).then(async () => {
				console.log(
					chalk.green(`[Init]`),
					`Server online! Took ${Date.now() - time}ms`,
				);

				process.send("ready");
			});
		});
	});
})();

process.on("SIGINT", async () => {
	const chalk = await import("chalk").then((module) => module.default);

	time = Date.now();

	console.log(chalk.red(`[Init]`), `Stopping server...`);

	Apollo.stop(chalk).then(() => {
		Discord.stop(chalk).then(() => {
			Fastify.stop(chalk).then(() => {
				WebSocket.stop(chalk);

				console.log(
					chalk.green(`[Init]`),
					`Ready to exit! Took ${Date.now() - time}ms`,
				);

				process.exit(0);
			});
		});
	});
});
