import lib_redis from "./redis";

const cacheEnabled = process.env.REDIS_CACHE === "true";

const redis = lib_redis.get("cache");

export default class lib_cache {
	public static async get(key: string) {
		if (!cacheEnabled)
			return {
				data: null,
			};

		try {
			const data = await redis.get(key);

			if (!data)
				return {
					data: null,
				};

			try {
				return {
					data: JSON.parse(data),
				};
			} catch (error) {
				return {
					data,
				};
			}
		} catch (error) {
			console.error(`🚨 [Cache Lib] Error while getting key ${key}`, error);

			return {
				data: null,
			};
		}
	}

	public static async set(key: string, value: object | string, ttl: number) {
		if (!cacheEnabled) return;

		try {
			if (typeof value === "object") {
				value = JSON.stringify(value);
			}

			return await redis.set(key, value, "EX", ttl);
		} catch (error) {
			console.error(`🚨 [Cache Lib] Error while setting key ${key} to value ${value}`, error);

			throw error;
		}
	}

	public static async delete(key: string) {
		if (!cacheEnabled) return;

		try {
			await redis.del(key);
		} catch (error) {
			console.error(`🚨 [Cache Lib] Error while deleting key ${key}`, error);

			throw error;
		}
	}
}
