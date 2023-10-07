import { CronJob } from "cron";

import WebSocket from "@/runner/WebSocket";

import lib_discord from "@/modules/discord";

const jobs = [];

let chalk: any;

export default class Cron {
	public static async start(chalkModule: any) {
		chalk = chalkModule;

		const io = WebSocket.getIO();

		return new Promise(async (resolve) => {
			console.log(chalk.blue(`[Cron]`), `Starting Jobs...`);

			jobs.push(
				new CronJob(
					"*/10 * * * * *",
					async () => {
						// console.log("You will see this message every 10 seconds");

						await lib_discord.getInfo(false);

						io.to("discord").emit("update");

						// console.log("Sent update to discord channel");
					},
					null,
					true,
					"America/Los_Angeles",
				),
			);

			console.log(chalk.magenta(`[Cron]`), `Started All Jobs`);

			resolve(true);
		});
	}

	public static async stop() {
		return new Promise(async (resolve) => {
			console.log(chalk.blue(`[Cron]`), `Stopping All Jobs...`);

			for (const job of jobs) {
				await job.stop();
			}

			console.log(chalk.magenta(`[Cron]`), `Stopped All Jobs`);

			resolve(true);
		});
	}
}
