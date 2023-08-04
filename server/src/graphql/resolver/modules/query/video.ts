import { GraphQLError } from "graphql";

import lib_cache from "@iunstable0/server-libs/build/cache";
import lib_storage from "@iunstable0/server-libs/build/storage";
import lib_error from "@iunstable0/server-libs/build/error";

export default class query_video {
  public static async getVideos(args: any) {
    // console.log("getting vid");
    let videos: any;

    try {
      const videoDirList = (await lib_storage.listFiles("videos")).filter(
        (filename) => filename.includes("-video"),
      );

      console.log(videoDirList);

      // console.log("viddor");

      let currentVideoDir = videoDirList[0];

      console.log(currentVideoDir);

      if (videoDirList.length > 1) {
        // console.log("viddor3");
        //   Compare the number of children in each directory, and get the one with the most children
        //   This is to prevent the case where the video directory is empty

        let maxChildren = 0;

        console.log(videoDirList);

        for (const videoDir of videoDirList) {
          // console.log("viddor3", videoDir);
          const children = await lib_storage.listFiles(`videos/${videoDir}`);

          // console.log("viddor3", children);

          if (children.length > maxChildren) {
            // console.log("viddor3oass");

            maxChildren = children.length;
            currentVideoDir = videoDir;
          } else if (children.length === maxChildren) {
            // console.log("viddor3fail");
            currentVideoDir = videoDir;
          }
        }

        // console.log("viddor4");
      }

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
      const name = video.split(`/`).slice(2).join(`/`);

      return {
        title: name.split(`.`).slice(0, -1).join(`.`),
        path: encodeURI(`https://objects.iunstable0.com/${video}`),
      };
    });
  }
}
