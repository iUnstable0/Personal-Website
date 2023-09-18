import { GraphQLError } from "graphql";

import axios from "axios";

import lib_cache from "@iunstable0/server-libs/build/cache";
import lib_storage from "@iunstable0/server-libs/build/storage";
import lib_error from "@iunstable0/server-libs/build/error";

export default class query {
	private static async fetchWebringData(retries = 3): Promise<any> {
		if (retries < 3) console.log(`[Webring Query] Retrying...`);
		try {
			const cachedWebring: any = await lib_cache.get(`cache_webring`);

			if (cachedWebring.data) {
				return cachedWebring.data;
			} else {
				// const webring = await (
				// 	await fetch(
				// 		"https://raw.githubusercontent.com/hackclub/webring/main/members.json",
				// 	)
				// ).json();

				let webring = (
					await axios.get(
						"https://raw.githubusercontent.com/hackclub/webring/main/public/members.json",
						{
							headers: {
								"Content-Type": "application/json",
							},
						},
					)
				).data;

				await lib_cache.set(`cache_webring`, webring, 300);

				return webring;
			}
		} catch (error) {
			if (retries <= 1) {
				const referenceCode = lib_error.generateReferenceCode();

				console.error(
					`[Webring Query] [${referenceCode}] Failed to get webring`,
					error,
				);

				throw new GraphQLError(`Internal server error. Ref: ${referenceCode}`, {
					extensions: {
						code: "INTERNAL_SERVER_ERROR",
						http: { status: 500 },
					},
				});
			}

			console.error(
				`[Webring Query] [No ref code] Failed to get webring (retrying)`,
				error,
			);

			// If error and retries left, wait for a second (or any duration) and then retry
			await new Promise((resolve) => setTimeout(resolve, 2000));

			return query.fetchWebringData(retries - 1);
		}
	}

	public static async getData(args: any) {
		//, contextValue: any) {
		const { videoFormat } = args;

		// console.log(format)

		// console.log("getting vid");
		let videos: any;

		// console.log("useragent", contextValue.req.headers["user-agent"]);

		try {
			const videoDirList = (await lib_storage.listFiles("")).filter(
				(filename) => filename.includes(`-video`),
			);

			// console.log(videoDirList)

			const webm = videoDirList.filter((filename) =>
				filename.includes(`-webm-video`),
			);

			// console.log(webm)

			const mp4 = videoDirList.filter((filename) =>
				filename.includes(`-mp4-video`),
			);

			// console.log(mp4)

			const currentVideoDir = videoFormat === "webm" ? webm[0] : mp4[0];

			// console.log(currentVideoDir)

			const cachedVideos: any = await lib_cache.get(
				`cache_videos_${currentVideoDir}`,
			);

			if (cachedVideos.data) {
				videos = cachedVideos.data;

				// console.log("viddor5");
			} else {
				videos = await lib_storage.listFiles(currentVideoDir);

				await lib_cache.set(`cache_videos`, videos, 60);

				// console.log("viddor6");
			}

			// console.log(videos)

			// console.log("viddor7");
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

		// console.log("viddor8");

		videos.shift();

		// console.log(videos);

		// console.log("viddor9");

		// Videos are sth like ["videos/123/name.mp4"]
		// Name might contain slash, so we split by slash and get from index 2 to the end and join them back to get real name
		// Also remove the video extension (might be mp4 or webm)
		// video name could contain dot as well, so we split by dot remove last element and join them back

		const finalVideos = videos.map((video: string) => {
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
		});

		// get webring fromhttps://raw.githubusercontent.com/hackclub/webring/main/members.json

		let webring: any;

		try {
			webring = await query.fetchWebringData();
		} catch (error) {
			const referenceCode = lib_error.generateReferenceCode();

			console.error(
				`[Webring Query] [${referenceCode}] Failed to get webring (x3)`,
				error,
			);

			throw new GraphQLError(`Internal server error. Ref: ${referenceCode}`, {
				extensions: {
					code: "INTERNAL_SERVER_ERROR",
					http: { status: 500 },
				},
			});
		}

		return {
			videos: finalVideos,
			webring,
		};
	}
}
