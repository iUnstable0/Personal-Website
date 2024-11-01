// if (process.env.NODE_ENV !== "development") {
// 	require("module-alias/register");
// }

let time = Date.now();

require("better-logging")(console);

import WebSocket from "@/runner/WebSocket";
import Fastify from "@/runner/Fastify";
import Discord from "@/runner/Discord";
import Apollo from "@/runner/Apollo";
import Cron from "@/runner/Cron";

// @ts-ignore
process.send = process.send || function () {};

let chalk: any;

(async () => {
	chalk = await import("chalk").then((module) => module.default);

	WebSocket.start(chalk).then(() => {
		Fastify.start(chalk).then(() => {
			Discord.start(chalk).then(() => {
				Apollo.start(chalk).then(() => {
					Cron.start(chalk).then(() => {
						console.log(
							chalk.magenta(`[Init]`),
							`Server online! Took ${Date.now() - time}ms`,
						);

						process.send!("ready");
					});
				});
			});
		});
	});
})();

process.on("SIGINT", async () => {
	// const chalk = await import("chalk").then((module) => module.default);

	time = Date.now();

	console.log(chalk.red(`[Init]`), `Stopping server...`);

	Cron.stop().then(() => {
		Apollo.stop().then(() => {
			Discord.stop().then(() => {
				Fastify.stop().then(() => {
					WebSocket.stop().then(() => {
						console.log(
							chalk.green(`[Init]`),
							`Ready to exit! Took ${Date.now() - time}ms`,
						);

						process.exit(0);
					});
				});
			});
		});
	});
});
