const { ApolloServer, ApolloServerPlugin } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const {
	ApolloServerPluginLandingPageLocalDefault,
	ApolloServerPluginLandingPageProductionDefault,
} = require("@apollo/server/plugin/landingPage/default");
const { makeExecutableSchema } = require("@graphql-tools/schema");

import { rateLimitDirective } from "graphql-rate-limit-directive";
const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } =
	rateLimitDirective();

import { GraphQLError } from "graphql";

// @ts-ignore
import depthLimit from "graphql-depth-limit";
import fs from "fs";
import path from "path";

import Resolver from "../graphql/resolver";

import lib_error from "../modules/error";

const plugins = [];

if (process.env.NODE_ENV === "production") {
	plugins.push(
		ApolloServerPluginLandingPageProductionDefault({
			embed: true,
			graphRef: "iunstable0s-team-5t8xap@main",
		})
	);
}

let schema = makeExecutableSchema({
	typeDefs: [
		rateLimitDirectiveTypeDefs,
		fs.readFileSync("./src/graphql/schema.graphql", "utf8"),
	],
	resolvers: Resolver,
});

schema = rateLimitDirectiveTransformer(schema);

const server = new ApolloServer({
	schema,

	csrfPrevention: true,
	introspection: true,

	validationRules: [depthLimit(14)],

	plugins,

	formatError: (formattedError: any, error: any) => {
		if (error.extensions.http)
			return {
				message: error.message,
				code: error.extensions.code,
			};

		if (error.message.includes("Too many requests"))
			return {
				message: error.message,
				code: "TOO_MANY_REQUESTS",
			};
		const referenceCode = lib_error.generateReferenceCode();

		console.log(`🚨 [Apollo] [${referenceCode}] ${error.message}`);

		return {
			message: `Internal server error. Ref: ${referenceCode}`,
			code: "INTERNAL_SERVER_ERROR",
		};
	},
});

export default class ApolloRunner {
	public static async start() {
		return new Promise((resolve, reject) => {
			console.log(`🔄 [Apollo] Starting Apollo Server...`);

			startStandaloneServer(server, {
				listen: { port: process.env.APOLLO_PORT },
				context: async ({ req, res }) => {
					// @ts-ignore
					const body = req.body;

					if (body) {
						const data = JSON.stringify(body);

						if (
							data.includes("IntrospectionQuery") &&
							data.includes("__schema")
						) {
							const introspectionKey = req.headers["authorization"];

							// console.log(req.headers);
							// console.log(introspectionKey);
							// console.log(typeof introspectionKey);
							// console.log(typeof process.env.INTROSPECTION_KEY);
							// console.log(
							// 	introspectionKey !==
							// 		process.env.INTROSPECTION_KEY
							// );
							// console.log(process.env.NODE_ENV !== "development");
							// console.log(
							// 	introspectionKey !==
							// 		process.env.INTROSPECTION_KEY &&
							// 		process.env.NODE_ENV !== "development"
							// );

							if (
								introspectionKey !== process.env.INTROSPECTION_KEY &&
								process.env.NODE_ENV !== "development"
							)
								throw new GraphQLError(
									"GraphQL introspection not authorized!",
									{
										extensions: {
											code: "UNAUTHORIZED",
											http: { status: 401 },
										},
									}
								);

							// console.log("📄 [Apollo] Responded to introspection query!");
						}
					}

					// let token = req.headers["authorization"];

					// token = token ? token.replaceAll("Bearer ", "") : null;

					// let result;

					// if (token && !token.includes("Introspection")) {
					// 	result = await lib_token.validateToken(
					// 		token,
					// 		"account",
					// 		(account: any, decodedToken: any) => {
					// 			if (account.passwordSession === decodedToken.passwordSession && account.accountSession === decodedToken.accountSession) {
					// 				return true;
					// 			}

					// 			return false;
					// 		},
					// 		{},
					// 		"token"
					// 	);
					// }

					// const authenticated = result ? (result.account ? true : false) : false;

					return {
						// session: authenticated ? result : null,
						// authenticated,
						// token,
						req,
					};
				},
			}).then(() => {
				console.log(
					`🚀 [Apollo] Apollo Server ready at http://${
						process.env.NODE_ENV === "production"
							? "127.0.0.1"
							: "fakelocal.com"
					}:${process.env.APOLLO_PORT}`
				);

				resolve(true);
			});
		});
	}

	public static async stop() {
		return new Promise((resolve, reject) => {
			console.log(`🔄 [Apollo] Stopping Apollo Server...`);

			server
				.stop()
				.then(() => {
					console.log(`🛑 [Apollo] Stopped Apollo Server`);

					resolve(true);
				})
				.catch((error: any) => {
					console.log(`🛑 [Apollo] Failed to stop Apollo Server`);

					resolve(true);
				});
		});
	}
}
