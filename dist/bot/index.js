"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const grammy_1 = require("grammy");
const dotenv_1 = __importDefault(require("dotenv"));
const draftsHandler_1 = require("./handlers/draftsHandler");
const showTimeSlotsHandler_1 = require("./handlers/showTimeSlotsHandler");
const backToPublishHandler_1 = require("./handlers/backToPublishHandler");
const sendStatusHandler_1 = require("./handlers/sendStatusHandler");
const publishedHandler_1 = require("./handlers/publishedHandler");
const productDetailsHandler_1 = require("./handlers/productDetailsHandler");
const downloadFileHandler_1 = require("./handlers/downloadFileHandler");
const resendToChannelHandler_1 = require("./handlers/resendToChannelHandler");
const chooseChannelHandler_1 = require("./handlers/chooseChannelHandler");
const scheduleHandler_1 = require("./handlers/scheduleHandler");
const jobsHandler_1 = require("./handlers/jobs/jobsHandler");
const removeJobHandler_1 = require("./handlers/jobs/removeJobHandler");
const showJobHandler_1 = require("./handlers/jobs/showJobHandler");
const authMiddleware_1 = require("./middlewares/authMiddleware");
const sessionMiddleware_1 = require("./middlewares/sessionMiddleware");
const customTimeMessageHandler_1 = require("./handlers/customTimeMessageHandler");
const customTimeCallbackHandler_1 = require("./handlers/customTimeCallbackHandler");
const customChannelHandler_1 = require("./handlers/customChannelHandler");
const cancelCustomTimeHandler_1 = require("./handlers/cancelCustomTimeHandler");
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
exports.bot = new grammy_1.Bot(process.env.BOT_TOKEN);
// ✅ Middlewares
exports.bot.use(sessionMiddleware_1.sessionMiddleware);
exports.bot.use(authMiddleware_1.authMiddleware);
// ✅ /start command
exports.bot.command("start", async (ctx) => {
    await ctx.reply("سلام! یکی از گزینه‌های زیر رو انتخاب کن:", {
        reply_markup: new grammy_1.Keyboard().text("📌 پیش‌نویس‌ها").text("🧾 همه محصولات").row().text("⏰ زمان‌بندی‌ها").resized().persistent(),
    });
});
// ✅ Text message handling
exports.bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;
    if (ctx.session.waitingForCustomTime)
        return await (0, customTimeMessageHandler_1.customTimeMessageHandler)(ctx);
    switch (text) {
        case "📌 پیش‌نویس‌ها":
            return (0, draftsHandler_1.draftsHandler)(ctx);
        case "🧾 همه محصولات":
            return (0, publishedHandler_1.publishedHandler)(ctx);
        case "⏰ زمان‌بندی‌ها":
            return (0, jobsHandler_1.jobsHandler)(ctx);
        default:
            await ctx.reply("لطفا یکی از گزینه‌های موجود رو انتخاب کن 🙏");
    }
});
// ✅ Callback queries
exports.bot.callbackQuery(/^select_time_/, showTimeSlotsHandler_1.showTimeSlotsHandler);
exports.bot.callbackQuery(/^schedule_/, scheduleHandler_1.scheduleHandler);
exports.bot.callbackQuery(/published_page_\d+/, publishedHandler_1.publishedHandler);
exports.bot.callbackQuery(/^product_\d+$/, productDetailsHandler_1.productDetailsHandler);
exports.bot.callbackQuery(/^download_\d+$/, downloadFileHandler_1.downloadFileHandler);
exports.bot.callbackQuery(/^remove_job_\d+$/, removeJobHandler_1.removeJobHandler);
exports.bot.callbackQuery(/^show_job_\d+$/, showJobHandler_1.showJobHandler);
exports.bot.callbackQuery(/back_to_publish_\d+/, backToPublishHandler_1.backToPublishHandler);
exports.bot.callbackQuery(/selected_time_\d+_.+/, chooseChannelHandler_1.chooseChannelHandler);
exports.bot.callbackQuery(/^resend_channel_\d+_.+$/, resendToChannelHandler_1.resendToChannelHandler);
exports.bot.callbackQuery(/^resend_\d+$/, sendStatusHandler_1.resendHandler);
exports.bot.callbackQuery(/^mark_sent_\d+$/, sendStatusHandler_1.markSentHandler);
exports.bot.callbackQuery(/^unmark_sent_\d+$/, sendStatusHandler_1.unmarkSentHandler);
exports.bot.callbackQuery(/^custom_time_/, customTimeCallbackHandler_1.customTimeCallbackHandler);
exports.bot.callbackQuery(/^custom_channel_/, customChannelHandler_1.customChannelHandler);
exports.bot.callbackQuery(/^cancel_custom_time_\d+$/, cancelCustomTimeHandler_1.cancelCustomTimeHandler);
const MODE = process.env.NODE_ENV || "development";
const PORT = Number(process.env.PORT) || 3000;
if (MODE === "production") {
    // Webhook mode
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const secretToken = process.env.BOT_SECRET || "";
    // مسیر امن برای webhook
    app.use("/bot-webhook", (0, grammy_1.webhookCallback)(exports.bot, "express", { secretToken }));
    app.listen(PORT, () => {
        console.log(`🌐 Webhook server running at https://kalora.ir/bot-webhook`);
        console.log(`🤖 Telegram bot webhook active`);
    });
}
else {
    // Long polling mode (default)
    exports.bot.start();
    console.log("🤖 Bot running in POLLING mode (development)");
}
