import { Prisma, PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL not found');
    }
    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    // Helper to retry operations on connection errors
    const retryOperation = async (operation: () => Promise<any>) => {
      const maxRetries = 3;
      let retries = 0;

      while (retries < maxRetries) {
        try {
          return await operation();
        } catch (error) {
          this.logger.error(
            `Debug: Operation failed. Code: ${error?.code}, Message: ${error?.message}`,
          );

          const isConnectionError =
            error?.code === 'ECONNREFUSED' ||
            error?.code === 'ETIMEDOUT' ||
            error?.code === '57P03' || // cannot_connect_now
            error?.code === 'enotfound' || // Address not found
            error?.code === 'ENOTFOUND' || // Capitalized version just in case
            error?.code === 'EAI_AGAIN' || // Temporary DNS failure
            error?.message?.includes("Can't reach database");

          if (isConnectionError && retries < maxRetries) {
            retries++;
            this.logger.warn(
              `Database connection error (Attempt ${retries}/${maxRetries}): ${error.message}. Retrying...`,
            );
            await new Promise((resolve) => setTimeout(resolve, 200 * retries));
            continue;
          }
          throw error;
        }
      }
    };

    // Generic wrapper to handle both promise and callback styles
    const wrapWithRetry = (
      originalFn: (...args: any[]) => any,
      context: any,
      methodName: string,
    ) => {
      return (...args: any[]) => {
        const lastArg = args[args.length - 1];
        const isCallback = typeof lastArg === 'function';

        if (isCallback) {
          const cb = lastArg;
          const argsWithoutCb = args.slice(0, -1);

          retryOperation(() => {
            return new Promise((resolve, reject) => {
              originalFn.call(context, ...argsWithoutCb, (err, res) => {
                if (err) reject(err);
                else resolve(res);
              });
            });
          })
            .then((res) => {
              // If it's the connect method, the result is the client, so wrap it
              if (methodName === 'connect') {
                wrapClient(res);
                // The callback for connect expects (err, client, done)
                const release = res.release ? res.release.bind(res) : () => {};
                cb(null, res, release);
              } else {
                cb(null, res);
              }
            })
            .catch((err) => {
              cb(err);
            });
          return; // Return void
        }

        // Promise style
        return (async () => {
          const res = await retryOperation(() =>
            originalFn.apply(context, args),
          );
          if (methodName === 'connect') {
            wrapClient(res);
          }
          return res;
        })();
      };
    };

    // Helper to wrap the client's query method
    const wrapClient = (client: any) => {
      if (client._isWrapped) return client;
      client._isWrapped = true;

      const originalClientQuery = client.query;
      client.query = wrapWithRetry(originalClientQuery, client, 'query');
      return client;
    };

    // Wrap pool.query
    const originalPoolQuery = pool.query;
    pool.query = wrapWithRetry(originalPoolQuery, pool, 'query') as any;

    // Wrap pool.connect
    const originalPoolConnect = pool.connect;
    pool.connect = wrapWithRetry(originalPoolConnect, pool, 'connect') as any;

    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    });

    this.pool = pool;

    this.$on('query', (e) => {
      this.logger.debug(
        `query: ${e.query}, params: ${e.params}, duration: ${e.duration}ms`,
      );
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.pool.end();
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('query', async () => {
      await app.close();
    });
  }
}
