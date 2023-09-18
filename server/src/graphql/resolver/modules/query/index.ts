import { GraphQLError } from "graphql";

import axios from "axios";
import tinycolor from "tinycolor2";

import lib_cache from "@iunstable0/server-libs/build/cache";
import lib_storage from "@iunstable0/server-libs/build/storage";
import lib_error from "@iunstable0/server-libs/build/error";
import lib_axios from "@iunstable0/server-libs/build/axios";
// import lib_data from "@iunstable0/server-libs/build/data";

import lib_data from "@/modules/data";
import lib_color from "@/modules/color";

export default class query {
	// GitHub sometimes return EHOSTUNREACH error, so we retry 3 times
	private static async fetchWebringData(retries = 3): Promise<any> {
		if (retries < 3) console.log(`[Main Query] Retrying...`);

		const cachedWebring: any = await lib_cache.get(`cache_webring`);

		if (cachedWebring.data) {
			return cachedWebring.data;
		} else {
			try {
				const webring = (
					await axios.get(
						"https://raw.githubusercontent.com/hackclub/webring/main/public/members.json",
						{
							headers: {
								"Content-Type": "application/json",
							},
						},
					)
				).data;

				await lib_data.writeFile("webring.json", webring);
				await lib_cache.set(`cache_webring`, webring, 600);

				return webring;
			} catch (error) {
				if (retries <= 1) {
					// const referenceCode = lib_error.generateReferenceCode();
					//
					// console.error(
					// 	`[Main Query] [${referenceCode}] Failed to get webring`,
					// 	lib_axios.parseError(error),
					// );
					//
					// throw new GraphQLError(
					// 	`Internal server error. Ref: ${referenceCode}`,
					// 	{
					// 		extensions: {
					// 			code: "INTERNAL_SERVER_ERROR",
					// 			http: { status: 500 },
					// 		},
					// 	},
					// );

					console.error(
						`[Main Query] Failed to get webring, serving from local instead.`,
						lib_axios.parseError(error),
					);

					// Serve local webring.json if we can't get it from GitHub

					if (!(await lib_data.exists("webring.json"))) {
						await lib_data.writeFile("webring.json", []);
					}

					const webring = await lib_data.readFile("webring.json");

					await lib_cache.set(`cache_webring`, webring, 600);

					return webring;
				}

				console.error(
					`[Main Query] Failed to get webring`,
					lib_axios.parseError(error),
				);

				// If error and retries left, wait for a second (or any duration) and then retry
				await new Promise((resolve) => setTimeout(resolve, 2000));

				return query.fetchWebringData(retries - 1);
			}
		}
	}

	public static async getData(args: any) {
		//, contextValue: any) {
		const { videoFormat } = args;

		let webring: any;

		try {
			webring = await query.fetchWebringData();
		} catch (error) {
			// const referenceCode = lib_error.generateReferenceCode();
			//
			// console.error(
			// 	`[Main Query] [${referenceCode}] Failed to get webring`,
			// 	error,
			// );
			//
			// throw new GraphQLError(`Internal server error. Ref: ${referenceCode}`, {
			// 	extensions: {
			// 		code: "INTERNAL_SERVER_ERROR",
			// 		http: { status: 500 },
			// 	},
			// });

			console.error(
				`[Main Query] Failed to get webring, serving from local instead.`,
				lib_axios.parseError(error),
			);

			// Serve local webring.json if we can't get it from GitHub

			if (!(await lib_data.exists("webring.json"))) {
				await lib_data.writeFile("webring.json", []);
			}

			webring = await lib_data.readFile("webring.json");

			await lib_cache.set(`cache_webring`, webring, 600);
		}

		const strippedDscordUserId = process.env.DISCORD_USER_ID.substring(0, 5);

		const localDiscordInfoFile = `discordInfo_${strippedDscordUserId}.json`;
		const discordInfoCacheKey = `cache_discordInfo_${strippedDscordUserId}`;

		const cachedDiscordInfo: any = await lib_cache.get(discordInfoCacheKey);

		let discordInfo;

		if (cachedDiscordInfo.data) {
			discordInfo = cachedDiscordInfo.data;
		} else {
			try {
				discordInfo = (
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

				await lib_data.writeFile(localDiscordInfoFile, discordInfo);

				await lib_cache.set(discordInfoCacheKey, discordInfo, 60);
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
					`[Main Query] Failed to get discord info, serving from local instead.`,
					lib_axios.parseError(error),
				);

				// Serve local discordInfo.json if we can't get it from Discord API

				if (!(await lib_data.exists(localDiscordInfoFile))) {
					await lib_data.writeFile(localDiscordInfoFile, {});
				}

				discordInfo = await lib_data.readFile(localDiscordInfoFile);
			}
		}

		const primaryColor = `#${lib_color.fix(
			discordInfo.user_profile.theme_colors[0].toString(16),
		)}`;

		const secondaryColor = `#${lib_color.fix(
			discordInfo.user_profile.theme_colors[1].toString(16),
		)}`;

		const tinycolorPrimary = tinycolor(primaryColor);
		const tinycolorSecondary = tinycolor(secondaryColor);

		const processedPrimary = tinycolorPrimary.isLight()
				? lib_color.addWhiteOverlay(tinycolorPrimary, 0.6)
				: lib_color.addBlackOverlay(tinycolorPrimary, 0.6),
			processedSecondary = tinycolorSecondary.isLight()
				? lib_color.addWhiteOverlay(tinycolorSecondary, 0.6)
				: lib_color.addBlackOverlay(tinycolorSecondary, 0.6);

		const discordAvatar = `https://cdn.discordapp.com/avatars/${
			discordInfo.user.id
		}/${discordInfo.user.avatar}.${
			discordInfo.user.avatar.startsWith("a_") ? "gif" : "png"
		}?size=2048`;

		const discordBanner = discordInfo.user_profile.banner
			? `https://cdn.discordapp.com/banners/${discordInfo.user.id}/${
					discordInfo.user_profile.banner
			  }.${
					discordInfo.user_profile.banner.startsWith("a_") ? "gif" : "png"
			  }?size=4096`
			: null;

		const processedDiscordInfo = {
			id: discordInfo.user.id,
			username: discordInfo.user.username,
			avatar: discordAvatar,
			avatar_decoration: discordInfo.user.avatar_decoration,
			discriminator: discordInfo.user.discriminator,
			banner: discordBanner,
			theme: tinycolorPrimary.isLight() ? "light" : "dark",
			// customActivity:
			// 	member.presence &&
			// 	member.presence?.activities &&
			// 	member.presence?.activities.length > 0
			// 		? {
			// 				state: member.presence.activities[0].state,
			// 				emoji: member.presence.activities[0].emoji,
			// 		  }
			// 		: null,
			seperatorColor: lib_color.getColorFromGradientPoint(
				processedPrimary,
				processedSecondary,
				0.15,
			),
			theme_colors: {
				primary: {
					original: primaryColor,
					processed: processedPrimary,
				},
				secondary: {
					original: secondaryColor,
					processed: processedSecondary,
				},
			},
			bio: discordInfo.user_profile.bio,
		};

		console.log(processedDiscordInfo);

		let videos: any;

		try {
			const videoSources = (await lib_storage.listFiles("")).filter(
				(filename) => filename.includes(`-video`),
			);

			const targetVideoSource = videoSources.filter((source) =>
				source.includes(`-${videoFormat}-video`),
			)[0];

			const cachedVideos: any = await lib_cache.get(
				`cache_videos_${targetVideoSource}`,
			);

			if (cachedVideos.data) {
				videos = cachedVideos.data;
			} else {
				videos = await lib_storage.listFiles(targetVideoSource);

				await lib_cache.set(`cache_videos`, videos, 60);
			}
		} catch (error) {
			const referenceCode = lib_error.generateReferenceCode();

			console.error(
				`[Video Query] [${referenceCode}] Failed to get videos`,
				error,
			);

			throw new GraphQLError(`Internal server error. Ref: ${referenceCode}`, {
				extensions: {
					code: "INTERNAL_SERVER_ERROR",
					http: { status: 500 },
				},
			});
		}

		// Idek why this is here (commenting out for now)
		// videos.shift();

		// Videos are sth like ["videos/name.mp4"]
		// Name might contain slash, so we split by slash and get from index 2 to the end and join them back to get real name
		// Also remove the video extension (might be mp4 or webm)
		// video name could contain dot as well, so we split by dot remove last element and join them back

		return {
			videos: videos.map((video: string) => {
				const name = video.split(`/`).slice(1).join(`/`);

				return {
					title: name.split(`.`).slice(0, -1).join(`.`),
					path: encodeURI(
						`${
							process.env[
								`${process.env.S3_PROVIDER.toUpperCase()}_S3_CUSTOM_DOMAIN`
							]
						}/${video}`,
					),
				};
			}),
			webring,
		};
	}
}
