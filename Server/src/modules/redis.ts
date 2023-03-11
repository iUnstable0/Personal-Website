import Redis from "ioredis";

function createRedis(db: number) {
	return new Redis({
		host: "127.0.0.1",
		port: Number(process.env.REDIS_PORT),

		username: process.env.REDIS_USERNAME,
		password: process.env.REDIS_PASSWORD,

		connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT),

		db: db + Number(process.env.REDIS_STACK) * 100,
	});
}

const redisInstances = {};

export default class lib_redis {
	public static get(db: string, ignorePool?: boolean) {
		if (ignorePool) {
			return createRedis(Number(process.env[`REDIS_${db.toUpperCase()}_DB`]));
		}

		if (!redisInstances[db]) {
			redisInstances[db] = createRedis(Number(process.env[`REDIS_${db.toUpperCase()}_DB`]));
		}

		return redisInstances[db];
	}
}
