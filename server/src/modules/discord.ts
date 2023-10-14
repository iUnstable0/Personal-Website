import axios from "axios";
import tinycolor from "tinycolor2";

// import lib_cache from "@iunstable0/server-libs/build/cache";
import lib_data from "@iunstable0/server-libs/build/data";
import lib_axios from "@iunstable0/server-libs/build/axios";

import Discord from "@/runner/Discord";

import lib_color from "@/modules/color";

const client = Discord.getClient();

export default class lib_discord {
	public static async getInfo(cache = true) {
		const strippedDiscordUserId = process.env.DISCORD_USER_ID.substring(0, 5);

		const localDiscordInfoFile = `discordInfo_${strippedDiscordUserId}.json`;
		// const discordInfoCacheKey = `cache_discordInfo_${strippedDiscordUserId}`;

		// const cachedDiscordInfo: any = await lib_cache.get(discordInfoCacheKey);

		let discordInfo: any = {};

		if (cache && lib_data.exists(localDiscordInfoFile)) {
			discordInfo = await lib_data.readFile(localDiscordInfoFile);
		} else {
			try {
				const data: any = (
					await axios.get(
						`https://discord.com/api/v9/users/${process.env.DISCORD_USER_ID}/profile?with_mutual_guilds=false&with_mutual_friends_count=false`,
						{
							headers: {
								Accept: "*/*",
								Authorization: process.env.DISCORD_TOKEN,
							},
						},
					)
				).data;

				// console.log(data);

				const primaryColor = `#${lib_color.fix(
					data.user_profile.theme_colors[0].toString(16),
				)}`;

				const secondaryColor = `#${lib_color.fix(
					data.user_profile.theme_colors[1].toString(16),
				)}`;

				const tinycolorPrimary = tinycolor(primaryColor);
				const tinycolorSecondary = tinycolor(secondaryColor);

				const processedPrimary = tinycolorPrimary.isLight()
					? lib_color.addWhiteOverlay(tinycolorPrimary, 0.6)
					: lib_color.addBlackOverlay(tinycolorPrimary, 0.6);

				const processedSecondary = tinycolorPrimary.isLight()
					? lib_color.addWhiteOverlay(tinycolorSecondary, 0.6)
					: lib_color.addBlackOverlay(tinycolorSecondary, 0.6);

				const discordAvatar = `https://cdn.discordapp.com/avatars/${
					data.user.id // Idk if i should use data.user.id or process.env.DISCORD_USER_ID
				}/${data.user.avatar}.${
					data.user.avatar.startsWith("a_") ? "gif" : "png"
				}?size=2048`;

				const discordBanner = data.user_profile.banner
					? `https://cdn.discordapp.com/banners/${data.user.id}/${
							data.user_profile.banner
					  }.${
							data.user_profile.banner.startsWith("a_") ? "gif" : "png"
					  }?size=4096`
					: null;

				discordInfo = {
					id: data.user.id, // Same here ;p
					username: data.user.username,
					globalName: data.user.global_name,
					avatar: discordAvatar,
					avatarDecoration: data.user.avatar_decoration,
					banner: discordBanner,
					theme: tinycolorPrimary.isLight() ? "light" : "dark",
					activity: await lib_discord.getActivity(),
					seperatorColor: lib_color.getColorFromGradientPoint(
						processedPrimary,
						processedSecondary,
						0.15,
					),
					themeColors: {
						primary: {
							original: primaryColor,
							processed: processedPrimary,
						},
						secondary: {
							original: secondaryColor,
							processed: processedSecondary,
						},
					},
					bio: data.user_profile.bio,
					pronouns: data.user_profile.pronouns,
					badges: data.badges,
				};

				lib_data.writeFile(localDiscordInfoFile, discordInfo);

				// await lib_cache.set(discordInfoCacheKey, discordInfo, 60);
			} catch (error) {
				// const referenceCode = lib_error.generateReferenceCode();

				// console.error(
				// 	`[Main Query] [${referenceCode}] Failed to get discord info`,
				// 	lib_axios.parseError(error),
				// );
				//
				// throw new GraphQLError(`Internal server error. Ref: ${referenceCode}`, {
				// 	extensions: {
				// 		code: "INTERNAL_SERVER_ERROR",
				// 		http: { status: 500 },
				// 	},
				// });

				console.error(
					`[Main Query] Failed to get discord info.`,
					lib_axios.parseError(error),
				);

				if (!cache) {
					discordInfo = await lib_data.readFile(localDiscordInfoFile);
				}

				// // Serve local discordInfo.json if we can't get it from Discord API
				//
				// if (!lib_data.exists(localDiscordInfoFile)) {
				// 	lib_data.writeFile(localDiscordInfoFile, {});
				// }
				//
				// discordInfo = { } }
			}
		}

		return discordInfo;
	}

	public static async getActivity() {
		const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
		const member = guild.members.cache.get(process.env.DISCORD_USER_ID);

		let customStatus: any;

		console.log(member.presence);

		const activities: any[] = [];

		for (const activity of member.presence?.activities) {
			if (activity.name === "Custom Status") {
				customStatus = {
					state: activity.state,
					emoji: activity.emoji,
				};
			} else {
				activities.push({
					name: activity.name,
					details: activity.details,
					state: activity.state,
					applicationId: activity.applicationId,
					timestamps: activity.timestamps,
					assets: activity.assets,
					createdTimestamp: activity.createdTimestamp,
				});
			}
		}

		return {
			customStatus,
			activities,
		};
	}
}
