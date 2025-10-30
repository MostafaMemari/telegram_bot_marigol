import { session, SessionFlavor } from "grammy";
import { RedisAdapter } from "@grammyjs/storage-redis";
import type { Context } from "grammy";
import IORedis from "ioredis";

export interface SessionData {
  waitingForCustomTime?: { productId: string };
}

export type MyContext = Context & SessionFlavor<SessionData>;

const redisInstance = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");

const storage = new RedisAdapter<SessionData>({
  instance: redisInstance,
  ttl: 60 * 60, // 1 Hour
  autoParseDates: true,
});

export const sessionMiddleware = session({
  initial: (): SessionData => ({}),
  storage,
});
