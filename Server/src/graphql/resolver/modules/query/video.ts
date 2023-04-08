import { GraphQLError } from "graphql";

import lib_cache from "@iunstable0/server-libs/build/cache";
import lib_storage from "@iunstable0/server-libs/build/storage";
import lib_error from "@iunstable0/server-libs/build/error";

export default class query_video {
  public static async getVideos(args: any) {
    let videos: any;

    try {
      const cachedVideos: any = await lib_cache.get(`cache_videos`);

      if (cachedVideos.data) {
        videos = cachedVideos.data;
      } else {
        videos = await lib_storage.listFiles(
          `videos/753ab64c-202f-4e1f-a01f-2a345d09f17e`
        );

        await lib_cache.set(`cache_videos`, videos, 60);
      }
    } catch (error) {
      const referenceCode = lib_error.generateReferenceCode();

      console.error(
        `[Video Query] [${referenceCode}] Failed to get videos`,
        error
      );

      throw new GraphQLError(`Internal server error. Ref: ${referenceCode}`, {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          http: { status: 500 },
        },
      });
    }

    videos.shift();

    // Videos are sth like ["videos/123/name.mp4"]
    // Name might contain slash, so we split by slash and get from index 2 to the end and join them back to get real name
    // Also remove the video extension (might be mp4 or webm)
    // video name could contain dot as well, so we split by dot remove last element and join them back

    return videos.map((video: string) => {
      const name = video.split(`/`).slice(2).join(`/`);

      return {
        title: name.split(`.`).slice(0, -1).join(`.`),
        path: encodeURI(`https://objects.iunstable0.com/${video}`),
      };
    });
  }
}
