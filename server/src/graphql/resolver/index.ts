// noinspection JSUnusedGlobalSymbols

import { ByteResolver, DateResolver } from "graphql-scalars";

import query from "./modules/query";

type argsType = [parent: any, args: any, contextValue: any];

export default {
	Query: {
		getData: (...args: argsType) => query.getData(args[1]), //, args[2]),
		discordInfo: (...args: argsType) => query.getDiscordInfo(), //, args[2]),
		extraDiscordInfo: (...args: argsType) => query.getExtraDiscordInfo(), //, args[2]),
		discordActivity: (...args: argsType) => query.getDiscordActivity(), //, args[2]),
	},
	Date: DateResolver,
	Byte: ByteResolver,
};
