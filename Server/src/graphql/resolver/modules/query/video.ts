import { GraphQLError } from "graphql";

import lib_redis from "../../../../modules/redis";
import lib_cache from "../../../../modules/cache";
import lib_storage from "../../../../modules/storage";
import lib_error from "../../../../modules/error";

export default class query_video {
	public static async getVideos(args: any) {
		let videos: any;

		try {
			const cachedVideos: any = lib_cache.get(`cache_videos`);

			if (cachedVideos.data) {
				videos = cachedVideos.data;
			} else {
				videos = await lib_storage.listFiles(`vidoes/753ab64c-202f-4e1f-a01f-2a345d09f17e`);

				await lib_cache.set(`cache_videos`, videos, 60);
			}
		} catch (error) {
			const referenceCode = lib_error.generateReferenceCode();

			console.error(`🚨 [Video Query] [${referenceCode}] Failed to get videos`, error);

			throw new GraphQLError(`Internal server error. Ref: ${referenceCode}`, {
				extensions: {
					code: "INTERNAL_SERVER_ERROR",
					http: { status: 500 },
				},
			});
		}

		console.log(videos);

		// return videos;
		return [
			{
				title: "Avicii - The Nights",
				path: encodeURI("https://objects.iunstable0.com/videos/753ab64c-202f-4e1f-a01f-2a345d09f17e/Avicii - The Nights.mp4.mp4"),
			},
		];
	}
}
