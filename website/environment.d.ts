declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: "development" | "production" | "staging";

		NEXT_PUBLIC_ENVIRONMENT: "development" | "production" | "staging";
		NEXT_PUBLIC_GQL: string;
		NEXT_PUBLIC_WEBSOCKET: string;
	}
}
