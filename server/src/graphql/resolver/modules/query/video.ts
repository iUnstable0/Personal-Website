import { GraphQLError } from "graphql";

import lib_cache from "@iunstable0/server-libs/build/cache";
import lib_storage from "@iunstable0/server-libs/build/storage";
import lib_error from "@iunstable0/server-libs/build/error";

export default class query_video {
	public static async getVideos(args: any, contextValue: any) {
		const { format } = args;

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

			const currentVideoDir = format === "webm" ? webm[0] : mp4[0];

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

		return videos.map((video: string) => {
			const name = video.split(`/`).slice(1).join(`/`);

			return {
				title: name.split(`.`).slice(0, -1).join(`.`),
				path: encodeURI(`${process.env[`${process.env.S3_PROVIDER.toUpperCase()}_S3_CUSTOM_DOMAIN`]}/${video}`),
			};
		});
	}
}
