import {
	Client,
	GatewayIntentBits,
	Partials,
	ChannelType,
	// Events,
} from "discord.js";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
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
	partials: [
		Partials.User,
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.Reaction,
		Partials.GuildScheduledEvent,
		Partials.ThreadMember,
	],
});

let chalk: any;

export default class DiscordRunner {
	public static async start(chalkModule: any) {
		chalk = chalkModule;

		return new Promise(async (resolve) => {
			client.on("ready", async () => {
				console.log(
					chalk.magenta(`[Discord]`),
					`Logged in as ${client.user?.tag}!`,
				);

				resolve(true);
			});

			console.log(chalk.blue(`[Discord]`), `Logging in to Discord...`);

			await client.login(process.env.DISCORD_BOT_TOKEN);
		});
	}

	public static getClient() {
		return client;
	}

	public static async stop() {
		return new Promise(async (resolve) => {
			console.log(chalk.blue(`[Discord]`), `Logging out of Discord...`);

			await client.destroy();

			console.log(chalk.magenta(`[Discord]`), `Logged out of Discord!`);

			resolve(true);
		});
	}
}
