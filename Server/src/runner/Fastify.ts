import Fastify from "fastify";
import fastifyRateLimit from "@fastify/rate-limit";
import fs from "fs";
import path from "path";

import lib_redis from "../modules/redis";
import lib_axios from "../modules/axios";
import lib_cache from "../modules/cache";
import lib_error from "../modules/error";

const publicFastify = Fastify({
	trustProxy: true,
	// logger: true,
	bodyLimit: 30 * 1024 * 1024,
});

const ratelimitRedis = lib_redis.get("ratelimit");
const socketRedis = lib_redis.get("socket", true);

export default class FastifyRunner {
	public static async start() {
		return new Promise(async (resolve, reject) => {
			console.log(`🔄 [Fastify] Starting Public Fastify...`);

			await publicFastify.register(fastifyRateLimit, {
				keyGenerator: function (request: any) {
					return (
						request.headers["x-real-ip"] || // nginx
						request.headers["x-client-ip"] || // apache
						request.headers["x-forwarded-for"] || // use this only if you trust the header
						request.session?.username || // you can limit based on any session value
						request.ip
					); // fallback to default
				},
				redis: ratelimitRedis,
			});

			await publicFastify.setNotFoundHandler(
				{
					preHandler: publicFastify.rateLimit({
						max: 4,
						timeWindow: 500,
					}),
				},
				function (request, reply) {
					reply.code(404).send({
						error: "Not Found",
						message: "Route not found",
					});
				}
			);

			publicFastify.listen(
				{
					port: Number(process.env.PUBLIC_FASTIFY_PORT),
					host: "127.0.0.1",
				},
				() => {
					console.log(
						`🚀 [Fastify] Public Fastify ready at http://${
							process.env.NODE_ENV === "production"
								? "127.0.0.1"
								: "fakelocal.com"
						}:${process.env.PUBLIC_FASTIFY_PORT}/`
					);

					resolve(true);
				}
			);
		});
	}

	public static async stop() {
		return new Promise((resolve, reject) => {
			console.log(`🔄 [Fasitfy] Stopping Public Fastify...`);

			publicFastify.close().then(() => {
				console.log(`🛑 [Fasitfy] Stopped Public Fastify`);

				resolve(true);
			});
		});
	}
}
