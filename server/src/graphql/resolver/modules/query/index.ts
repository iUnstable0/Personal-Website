import { GraphQLError } from "graphql";

import axios from "axios";
// import tinycolor from "tinycolor2";

import lib_cache from "@iunstable0/server-libs/build/cache";
import lib_storage from "@iunstable0/server-libs/build/storage";
import lib_error from "@iunstable0/server-libs/build/error";
import lib_axios from "@iunstable0/server-libs/build/axios";
import lib_data from "@iunstable0/server-libs/build/data";

// import lib_color from "@/modules/color";
import lib_discord from "@/modules/discord";

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

			if (!lib_data.exists("webring.json")) {
				lib_data.writeFile("webring.json", []);
			}

			webring = await lib_data.readFile("webring.json");

			await lib_cache.set(`cache_webring`, webring, 600);
		}

		const discordInfo = await lib_discord.getInfo();

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
			discordInfo,
		};
	}

	public static async getDiscordInfo() {
		return await lib_discord.getInfo();
	}
}
