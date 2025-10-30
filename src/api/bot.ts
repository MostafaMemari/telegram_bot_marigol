import { Bot, Context, SessionFlavor, webhookCallback } from "grammy";
import dotenv from "dotenv";
import { Keyboard } from "grammy";

import { showTimeSlotsHandler } from "../bot/handlers/showTimeSlotsHandler";
import { backToPublishHandler } from "../bot/handlers/backToPublishHandler";
import { markSentHandler, resendHandler, unmarkSentHandler } from "../bot/handlers/sendStatusHandler";
import { publishedProductsHandler } from "../bot/handlers/publishedProductsHandler";
import { productDetailsHandler } from "../bot/handlers/productDetailsHandler";
import { downloadFileHandler } from "../bot/handlers/downloadFileHandler";
import { resendToChannelHandler } from "../bot/handlers/resendToChannelHandler";
import { chooseChannelHandler } from "../bot/handlers/chooseChannelHandler";
import { scheduleHandler } from "../bot/handlers/scheduleHandler";
import { jobsHandler } from "../bot/handlers/jobs/jobsHandler";
import { removeJobHandler } from "../bot/handlers/jobs/removeJobHandler";
import { showJobHandler } from "../bot/handlers/jobs/showJobHandler";
import { authMiddleware } from "../bot/middlewares/authMiddleware";
import { sessionMiddleware } from "../bot/middlewares/sessionMiddleware";
import { customTimeMessageHandler } from "../bot/handlers/customTimeMessageHandler";
import { customTimeCallbackHandler } from "../bot/handlers/customTimeCallbackHandler";
import { customChannelHandler } from "../bot/handlers/customChannelHandler";
import { cancelCustomTimeHandler } from "../bot/handlers/cancelCustomTimeHandler";
import { draftsHandler } from "../bot/handlers/draftsHandler";
import { connectDB } from "../database/connect";
import { draftProductHandler } from "../bot/handlers/draftProductHandler";
import { publishProduct } from "../services/wordpressService";
import { publishProductHandler } from "../bot/handlers/publishProductHandler";

dotenv.config();

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");

interface SessionData {
  waitingForCustomTime?: { productId: string; channelId: string };
}
export type MyContext = Context & SessionFlavor<SessionData>;

export const bot = new Bot<MyContext>(token);

// 🧩 Error handler — جلوگیری از کرش کل برنامه
bot.catch((err: any) => {
  console.error("⚠️ Bot error handled:", err.error?.description || err);
});

// 🧩 Session + Auth middlewares
bot.use(sessionMiddleware);
bot.use(authMiddleware);

// 🧩 Commands
bot.command("start", async (ctx) => {
  await ctx.reply("سلام! یکی از گزینه‌های زیر رو انتخاب کن:", {
    reply_markup: new Keyboard().text("📌 پیش‌نویس‌ها").text("🧾 همه محصولات").row().text("⏰ زمان‌بندی‌ها").resized().persistent(),
  });
});

// 🧩 Message handler
bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;
  if (ctx.session.waitingForCustomTime) return await customTimeMessageHandler(ctx);

  switch (text) {
    case "📌 پیش‌نویس‌ها":
      return draftsHandler(ctx);
    case "🧾 همه محصولات":
      return publishedProductsHandler(ctx);
    case "⏰ زمان‌بندی‌ها":
      return jobsHandler(ctx);
    default:
      await ctx.reply("لطفاً یکی از گزینه‌های موجود رو انتخاب کن 🙏");
  }
});

// 🧩 Callback queries
bot.callbackQuery(/^select_time_/, showTimeSlotsHandler);
bot.callbackQuery(/^schedule_/, scheduleHandler);
bot.callbackQuery(/published_page_\d+/, publishedProductsHandler);

bot.callbackQuery(/^draft_\d+$/, draftProductHandler);
bot.callbackQuery(/^publish_\d+$/, publishProductHandler);

bot.callbackQuery(/^product_\d+$/, productDetailsHandler);
bot.callbackQuery(/^download_\d+$/, downloadFileHandler);
bot.callbackQuery(/^remove_job_\d+$/, removeJobHandler);
bot.callbackQuery(/^show_job_\d+$/, showJobHandler);
bot.callbackQuery(/back_to_publish_\d+/, backToPublishHandler);
bot.callbackQuery(/selected_time_\d+_.+/, chooseChannelHandler);
bot.callbackQuery(/^resend_channel_\d+_.+$/, resendToChannelHandler);
bot.callbackQuery(/^resend_\d+$/, resendHandler);
bot.callbackQuery(/^mark_sent_\d+$/, markSentHandler);
bot.callbackQuery(/^unmark_sent_\d+$/, unmarkSentHandler);
bot.callbackQuery(/^custom_time_/, customTimeCallbackHandler);
bot.callbackQuery(/^custom_channel_/, customChannelHandler);
bot.callbackQuery(/^cancel_custom_time_\d+$/, cancelCustomTimeHandler);

// 🔧 Development mode (polling)
const isDev = process.env.NODE_ENV === "development";

async function startBot() {
  try {
    await connectDB();

    if (isDev) {
      console.log("🤖 Running in development mode with polling...");
      await bot.start();
    } else {
      console.log("🌍 Bot ready for production via webhook.");
    }
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
  }
}

startBot();

// 🔧 Webhook handler for Vercel / Production
export default async function handler(req: any, res: any) {
  if (isDev) {
    res.statusCode = 200;
    res.end("Bot is running in development mode");
    return;
  }

  const handle = webhookCallback(bot, "https");
  return handle(req, res);
}
