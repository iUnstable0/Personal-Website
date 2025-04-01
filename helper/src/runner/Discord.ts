import { Client, Events, GatewayIntentBits } from "discord.js";

import chalk from "chalk";

export default class DiscordRunner {
	public static client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildIntegrations,
			GatewayIntentBits.GuildWebhooks,
			GatewayIntentBits.GuildInvites,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.GuildPresences,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildMessageTyping,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.DirectMessageReactions,
			GatewayIntentBits.DirectMessageTyping,
			GatewayIntentBits.GuildScheduledEvents,
		],
	});

	public static async start() {
		return new Promise(async (resolve) => {
			this.client.once(Events.ClientReady, (readyClient) => {
				console.log(
					chalk.green("[Discord]"),
					`Logged in as ${readyClient.user?.tag}!`,
				);

				resolve(true);
			});

			console.log(chalk.blue(`[Discord]`), `Logging in to Discord...`);

			await this.client.login(process.env.DISCORD_BOT_TOKEN);
		});
	}

	public static async stop() {
		return new Promise(async (resolve) => {
			console.log(chalk.blue(`[Discord]`), `Logging out of Discord...`);

			await this.client.destroy();

			console.log(chalk.red(`[Discord`), `Logged out of Discord!`);

			resolve(true);
		});
	}
}
