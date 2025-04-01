declare namespace NodeJS {
	interface ProcessEnv {
		ENVIRONMENT: "development" | "staging" | "production";

		PORT: number;

		DISCORD_BOT_TOKEN: string;
	}
}
