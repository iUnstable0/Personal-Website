let time = Date.now();

require("better-logging")(console);

import chalk from "chalk";

import Discord from "@/runner/Discord";
import Fastify from "@/runner/Fastify";

function ready() {
	if (process.send) {
		process.send("ready");
	}
}

Discord.start().then(() => {
	Fastify.start().then(() => {
		console.log(
			chalk.magenta(`[Init]`),
			`Server online! Took ${Date.now() - time}ms`,
		);

		ready();
	});
});

process.on("SIGINT", async () => {
	time = Date.now();

	console.log(chalk.red(`[Init]`), `Stopping server...`);

	Fastify.stop().then(() => {
		Discord.start().then(() => {
			console.log(
				chalk.green(`[Init]`),
				`Ready to exit! Took ${Date.now() - time}ms`,
			);

			process.exit(0);
		});
	});
});
