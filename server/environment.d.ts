declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: "development" | "production" | "staging";

		APOLLO_PORT: string;

		CLOUDFLARE_S3_ACCESS_KEY: string;
		CLOUDFLARE_S3_CUSTOM_DOMAIN: string;
		CLOUDFLARE_S3_ENDPOINT: string;
		CLOUDFLARE_S3_SECRET_KEY: string;

		CONTABO_S3_ACCESS_KEY: string;
		CONTABO_S3_CUSTOM_DOMAIN: string;
		CONTABO_S3_ENDPOINT: string;
		CONTABO_S3_SECRET_KEY: string;

		DISCORD_BOT_TOKEN: string;
		DISCORD_GUILD_ID: string;
		DISCORD_TOKEN: string;
		DISCORD_USER_ID: string;

		PRIVATE_FASTIFY_PORT: string;
		PUBLIC_FASTIFY_PORT: string;

		REDIS_CACHE: string;
		REDIS_CONNECT_TIMEOUT: string;
		REDIS_DB_STACK: string;
		REDIS_HOST: string;
		REDIS_PASSWORD: string;
		REDIS_PORT: string;
		REDIS_USERNAME: string;

		S3_BUCKET_NAME: string;
		S3_CUSTOM_DOMAIN: string;
		S3_PROVIDER: string;

		SYNOLOGY_S3_ACCESS_KEY: string;
		SYNOLOGY_S3_CUSTOM_DOMAIN: string;
		SYNOLOGY_S3_ENDPOINT: string;
		SYNOLOGY_S3_SECRET_KEY: string;

		WEBSITE_PORT: string;

		WEBSOCKET_PORT: string;
	}
}
