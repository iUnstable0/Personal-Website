const chalk = require("ansi-colors");

import Fastify from "fastify";
import fastifyRateLimit from "@fastify/rate-limit";

import lib_redis from "@iunstable0/server-libs/build/redis";

const publicFastify = Fastify({
  trustProxy: true,
  // logger: true,
  bodyLimit: 30 * 1024 * 1024,
});

const redis = lib_redis.get();

export default class FastifyRunner {
  public static async start() {
    return new Promise(async (resolve, reject) => {
      console.log(chalk.blue(`[Fastify]`), `Starting Public Fastify...`);

      await publicFastify.register(fastifyRateLimit, {
        keyGenerator: function (request: any) {
          return `rateLimit_${
            request.headers["x-real-ip"] || // nginx
            request.headers["x-client-ip"] || // apache
            request.headers["x-forwarded-for"] || // use this only if you trust the header
            request.session?.username || // you can limit based on any session value
            request.ip
          }`; // fallback to default
        },
        redis: redis,
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
            chalk.magenta(`[Fastify]`),
            `Public Fastify ready at http://${
              process.env.NODE_ENV === "production"
                ? "127.0.0.1"
                : "fakelocal.com"
            }:${process.env.PUBLIC_FASTIFY_PORT}`
          );

          resolve(true);
        }
      );
    });
  }

  public static async stop() {
    return new Promise((resolve) => {
      console.log(chalk.blue(`[Fastify]`), `Stopping Public Fastify...`);

      publicFastify.close().then(() => {
        console.log(chalk.magenta(`[Fastify]`), `Stopped Public Fastify`);

        resolve(true);
      });
    });
  }
}
