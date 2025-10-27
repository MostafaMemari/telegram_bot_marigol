import { Bot, Keyboard, Context, SessionFlavor, webhookCallback } from "grammy";
import dotenv from "dotenv";

import { draftsHandler } from "./handlers/draftsHandler";
import { showTimeSlotsHandler } from "./handlers/showTimeSlotsHandler";
import { backToPublishHandler } from "./handlers/backToPublishHandler";
import { markSentHandler, resendHandler, unmarkSentHandler } from "./handlers/sendStatusHandler";
import { publishedHandler } from "./handlers/publishedHandler";
import { productDetailsHandler } from "./handlers/productDetailsHandler";
import { downloadFileHandler } from "./handlers/downloadFileHandler";
import { resendToChannelHandler } from "./handlers/resendToChannelHandler";
import { chooseChannelHandler } from "./handlers/chooseChannelHandler";
import { scheduleHandler } from "./handlers/scheduleHandler";
import { jobsHandler } from "./handlers/jobs/jobsHandler";
import { removeJobHandler } from "./handlers/jobs/removeJobHandler";
import { showJobHandler } from "./handlers/jobs/showJobHandler";
import { authMiddleware } from "./middlewares/authMiddleware";
import { sessionMiddleware } from "./middlewares/sessionMiddleware";
import { customTimeMessageHandler } from "./handlers/customTimeMessageHandler";
import { customTimeCallbackHandler } from "./handlers/customTimeCallbackHandler";
import { customChannelHandler } from "./handlers/customChannelHandler";
import { cancelCustomTimeHandler } from "./handlers/cancelCustomTimeHandler";
import express from "express";

dotenv.config();

interface SessionData {
  waitingForCustomTime?: { productId: string; channelId: string };
}

export type MyContext = Context & SessionFlavor<SessionData>;
export const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

// ✅ Middlewares
bot.use(sessionMiddleware);
bot.use(authMiddleware);

// ✅ /start command
bot.command("start", async (ctx) => {
  await ctx.reply("سلام! یکی از گزینه‌های زیر رو انتخاب کن:", {
    reply_markup: new Keyboard().text("📌 پیش‌نویس‌ها").text("🧾 همه محصولات").row().text("⏰ زمان‌بندی‌ها").resized().persistent(),
  });
});

// ✅ Text message handling
bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;

  if (ctx.session.waitingForCustomTime) return await customTimeMessageHandler(ctx);

  switch (text) {
    case "📌 پیش‌نویس‌ها":
      return draftsHandler(ctx);
    case "🧾 همه محصولات":
      return publishedHandler(ctx);
    case "⏰ زمان‌بندی‌ها":
      return jobsHandler(ctx);
    default:
      await ctx.reply("لطفا یکی از گزینه‌های موجود رو انتخاب کن 🙏");
  }
});

// ✅ Callback queries
bot.callbackQuery(/^select_time_/, showTimeSlotsHandler);
bot.callbackQuery(/^schedule_/, scheduleHandler);
bot.callbackQuery(/published_page_\d+/, publishedHandler);
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

const MODE = process.env.NODE_ENV || "development";
const PORT = Number(process.env.PORT) || 3000;

if (MODE === "production") {
  // Webhook mode
  const app = express();
  app.use(express.json());

  const secretToken = process.env.BOT_SECRET || "";

  // مسیر امن برای webhook
  app.use("/bot-webhook", webhookCallback(bot, "express", { secretToken }));

  app.listen(PORT, () => {
    console.log(`🌐 Webhook server running at https://kalora.ir/bot-webhook`);
    console.log(`🤖 Telegram bot webhook active`);
  });
} else {
  // Long polling mode (default)
  bot.start();
  console.log("🤖 Bot running in POLLING mode (development)");
}
