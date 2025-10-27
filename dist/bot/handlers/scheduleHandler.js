"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleHandler = scheduleHandler;
const scheduler_1 = require("../../utils/scheduler");
const wordpressService_1 = require("../../services/wordpressService");
async function scheduleHandler(ctx) {
    try {
        if (!ctx.callbackQuery?.data)
            return;
        await ctx.answerCallbackQuery();
        const data = ctx.callbackQuery.data;
        const [_, productId, time, channelId] = data.split("_");
        const chatId = ctx.callbackQuery.message?.chat.id;
        const messageId = ctx.callbackQuery.message?.message_id;
        const product = await (0, wordpressService_1.getProductById)(productId);
        (0, scheduler_1.addJob)({
            productId,
            time,
            chatId,
            messageId,
            productDetails: JSON.stringify(product),
            channelId,
        });
        await ctx.reply(`✅ محصول ${productId} با موفقیت برای ساعت ${time} زمان‌بندی شد`);
    }
    catch (err) {
        console.error("❌ خطا در زمان‌بندی:", err);
        await ctx.reply("❌ خطا در زمان‌بندی محصول.");
    }
}
