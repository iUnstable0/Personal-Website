const time = Date.now();

// @ts-ignore
process.send = process.send || function () {};

require("better-logging")(console);

console.log(`🔄 [Init] Loading ENV from .env...`);
require("dotenv").config({ path: ".env" });
console.log(`✅ [Init] Loaded ENV from .env`);

console.log(`🔄 [Init] Loading ENV from .env (GLOBAL)...`);
require("dotenv").config({ path: "../.env" });
console.log(`✅ [Init] Loaded ENV from .env (GLOBAL)`);

console.log(`🔄 [Init] Loading ENV from .env.${process.env.NODE_ENV}...`);
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
console.log(`✅ [Init] Loaded ENV from .env.${process.env.NODE_ENV}`);

console.log(
	`🔄 [Init] Loading ENV from .env.${process.env.NODE_ENV} (GLOBAL)...`
);
require("dotenv").config({ path: `../.env.${process.env.NODE_ENV}` });
console.log(`✅ [Init] Loaded ENV from .env.${process.env.NODE_ENV} (GLOBAL)`);

import Fastify from "./runner/Fastify";
import Apollo from "./runner/Apollo";
import WebSocket from "./runner/WebSocket";

WebSocket.start();

Fastify.start().then(() => {
	Apollo.start().then(() => {
		console.log(`✅ [Init] Server online! Took ${Date.now() - time}ms`);

		process.send("ready");
	});
});

process.on("SIGINT", async () => {
	Apollo.stop().then(() => {
		Fastify.stop().then(() => {
			WebSocket.stop();

			console.log("✅ [Init] Ready to exit");

			process.exit(0);
		});
	});
});
