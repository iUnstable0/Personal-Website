import Redis from "ioredis";

function createRedis() {
	return new Redis({
		host: "127.0.0.1",
		port: Number(process.env.REDIS_PORT),

		username: process.env.REDIS_USERNAME,
		password: process.env.REDIS_PASSWORD,

		connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT),

		db: Number(process.env.REDIS_DB_STACK),
	});
}

const redisInstances = {};

export default class lib_redis {
	public static get(db: string, ignorePool?: boolean) {
		if (ignorePool) {
			return createRedis();
		}

		if (!redisInstances[db]) {
			redisInstances[db] = createRedis();
		}

		return redisInstances[db];
	}
}
