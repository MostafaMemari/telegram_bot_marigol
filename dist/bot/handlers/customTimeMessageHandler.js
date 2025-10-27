"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customTimeMessageHandler = customTimeMessageHandler;
const scheduler_1 = require("../../utils/scheduler");
const wordpressService_1 = require("../../services/wordpressService");
const grammy_1 = require("grammy");
async function customTimeMessageHandler(ctx) {
    if (!ctx.session.waitingForCustomTime)
        return;
    const { productId, channelId } = ctx.session.waitingForCustomTime;
    const time = ctx.message?.text?.trim();
    const chatId = ctx.chat?.id;
    const messageId = ctx.message?.message_id;
    const keyboard = new grammy_1.InlineKeyboard().text("❌ لغو", `cancel_custom_time_${productId}`);
    if (!time || !/^\d{1,2}:\d{2}$/.test(time)) {
        await ctx.reply("⚠️ لطفا زمان را به‌صورت HH:MM وارد کنید (مثلاً 09:30)", {
            reply_markup: keyboard,
        });
        return;
    }
    const product = await (0, wordpressService_1.getProductById)(productId);
    (0, scheduler_1.addJob)({
        productId,
        time,
        chatId,
        messageId,
        productDetails: JSON.stringify(product),
        channelId,
    });
    await ctx.reply(`✅ محصول ${productId} برای ساعت ${time} در کانال انتخاب‌شده زمان‌بندی شد!`);
    ctx.session.waitingForCustomTime = undefined;
}
