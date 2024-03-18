import { CronJob } from "cron";

import WebSocket from "@/runner/WebSocket";

import lib_discord from "@/modules/discord";

const jobs: any = [];

let chalk: any;

export default class Cron {
	public static async start(chalkModule: any) {
		chalk = chalkModule;

		const io = WebSocket.getIO();

		return new Promise(async (resolve) => {
			console.log(chalk.blue(`[Cron]`), `Starting Jobs...`);

			jobs.push(
				new CronJob(
					"*/2 * * * * *",
					async () => {
						// console.log("You will see this message every 10 seconds");

						const result = await lib_discord.getActivity(false);

						if (result.changed) {
							console.log(
								"Data change detected, sending update to discord activity channel",
							);

							io.to("discord_activity").emit("update");
						}

						// console.log("Sent update to discord activity channel");
					},
					null,
					true,
					"America/Los_Angeles",
				),
			);

			jobs.push(
				new CronJob(
					"*/2 * * * * *",
					async () => {
						// console.log("You will see this message every 10 seconds");

						const result = await lib_discord.getInfo(false);

						if (result.changed) {
							console.log(
								"Data change detected, sending update to discord info channel",
							);

							io.to("discord_info").emit("update");
						}

						// console.log("Sent update to discord info channel");
					},
					null,
					true,
					"America/Los_Angeles",
				),
			);

			jobs.push(
				new CronJob(
					"*/10 * * * * *",
					async () => {
						// console.log("You will see this message every 10 seconds");

						const result = await lib_discord.getExtraInfo(false);

						if (result.changed) {
							console.log(
								"Data change detected, sending update to discord extra info channel",
							);

							io.to("discord_extra_info").emit("update");
						}

						// console.log("Sent update to discord info channel");
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
