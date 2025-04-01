import Fastify from "fastify";

import chalk from "chalk";
import DiscordRunner from "@/runner/Discord.ts";

const fastify = Fastify({
	bodyLimit: 30 * 1024 * 1024,
});

export default class FastifyRunner {
	public static async start() {
		return new Promise(async (resolve) => {
			console.log(chalk.blue(`[Fastify]`), `Starting Fastify...`);

			fastify.get("/", (request, reply) => {
				reply.send("Hello world!");
			});

			fastify.get("/discord-info/:guildId/:userId", async (request, reply) => {
				// console.log("requireee");

				const { guildId, userId } = request.params as {
					guildId: string;
					userId: string;
				};

				if (!guildId || !userId) {
					return reply.status(400).send("Bad request");
				}

				const guild = DiscordRunner.client.guilds.cache.get(guildId);
				const member = guild?.members.cache.get(userId);

				const discordAvatar = `https://cdn.discordapp.com/avatars/${
					member?.user.id
				}/${member?.user.avatar}.${
					member?.user.avatar?.startsWith("a_") ? "gif" : "png"
				}?size=128`;

				reply.status(200).send({
					id: parseInt(userId),
					username: member?.user.username,
					global_name: member?.user.globalName,
					avatar_url: discordAvatar,
				});
			});

			fastify.listen(
				{
					port: Number(process.env.PORT),
					host: "127.0.0.1",
				},
				() => {
					console.log(
						chalk.green(`[Fastify]`),
						`Fastify ready at http://127.0.0.1:${process.env.PORT}`,
					);

					resolve(true);
				},
			);
		});
	}

	public static async stop() {
		return new Promise(async (resolve) => {
			console.log(chalk.blue(`[Fastify]`), `Stopping Fastify...`);

			fastify.close().then(() => {
				console.log(chalk.red(`[Fastify]`), `Stopped Fastify!`);

				resolve(true);
			});
		});
	}
}
