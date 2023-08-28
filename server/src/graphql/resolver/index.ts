// noinspection JSUnusedGlobalSymbols

import { ByteResolver, DateResolver } from "graphql-scalars";

import query_video from "./modules/query/video";

type argsType = [parent: any, args: any, contextValue: any];

export default {
	Query: {
		getVideos: (...args: argsType) => query_video.getVideos(args[1], args[2]),
	},
	Date: DateResolver,
	Byte: ByteResolver,
};
