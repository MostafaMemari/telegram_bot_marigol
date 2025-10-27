import { session, SessionFlavor } from "grammy";
import { FileAdapter } from "@grammyjs/storage-file";
import type { Context } from "grammy";

export interface SessionData {
  waitingForCustomTime?: { productId: string };
}

export type MyContext = Context & SessionFlavor<SessionData>;

const storage = new FileAdapter<SessionData>({
  dirName: "sessions",
});

export const sessionMiddleware = session({
  initial: (): SessionData => ({}),
  storage,
});
