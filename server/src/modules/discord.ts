import Discord from "@/runner/Discord";

const client = Discord.getClient();

export default class lib_discord {
	public static async getCustomActivity() {
		const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
		const member = guild.members.cache.get(process.env.DISCORD_USER_ID);

		return member.presence &&
			member.presence?.activities &&
			member.presence?.activities.length > 0
			? {
					state: member.presence.activities[0].state,
					emoji: member.presence.activities[0].emoji,
			  }
			: null;
	}
}
