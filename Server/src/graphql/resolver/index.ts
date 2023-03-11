import { GraphQLScalarType, Kind } from "graphql";
import { ByteResolver, DateResolver } from "graphql-scalars";

import query_video from "./modules/query/video";

type argsType = [parent: any, args: any, contextValue: any];

export default {
	Query: {
		getVideos: (...args: argsType) => query_video.getVideos(args[1]),
	},
	// Mutation: {},
	Date: DateResolver,
	// Date: new GraphQLScalarType({
	// 	name: "Date",
	// 	description: "Date custom scalar type",
	// 	serialize(value: Date) {
	// 		return value.getTime(); // Convert outgoing Date to integer for JSON
	// 	},
	// 	parseValue(value: number) {
	// 		return new Date(value); // Convert incoming integer to Date
	// 	},
	// 	parseLiteral(ast) {
	// 		if (ast.kind === Kind.INT) {
	// 			// Convert hard-coded AST string to integer and then to Date
	// 			return new Date(parseInt(ast.value, 10));
	// 		}
	// 		// Invalid hard-coded value (not an integer)
	// 		return null;
	// 	},
	// }),
	Byte: ByteResolver,
};
