"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendHandler = resendHandler;
exports.markSentHandler = markSentHandler;
exports.unmarkSentHandler = unmarkSentHandler;
const grammy_1 = require("grammy");
const wordpressService_1 = require("../../services/wordpressService");
const channels_1 = require("../../constants/channels");
async function resendHandler(ctx) {
    const productId = ctx.callbackQuery?.data?.split("_")[1];
    console.log(`🔁 دکمه "ارسال مجدد" برای پست ${productId} کلیک شد.`);
    await ctx.answerCallbackQuery({ text: "📨 ارسال مجدد کلیک شد!" });
    const keyboard = new grammy_1.InlineKeyboard()
        .text("@marigol_ir", `resend_channel_${productId}_${channels_1.channels.marigol}`)
        .text("@sketchup_object_material", `resend_channel_${productId}_${channels_1.channels.sketchup_object_material}`);
    await ctx.reply("📡 لطفا کانال موردنظر را انتخاب کنید:", { reply_markup: keyboard });
}
async function markSentHandler(ctx) {
    const productId = Number(ctx.callbackQuery?.data?.split("_")[2]);
    await ctx.answerCallbackQuery();
    const success = await (0, wordpressService_1.markAsSent)(String(productId));
    if (success) {
        await ctx.reply(`✅ محصول ${productId} به عنوان ارسال‌شده ثبت شد.`);
    }
    else {
        await ctx.reply(`❌ خطا در ثبت وضعیت ارسال برای ${productId}`);
    }
}
async function unmarkSentHandler(ctx) {
    const productId = Number(ctx.callbackQuery?.data?.split("_")[2]);
    await ctx.answerCallbackQuery();
    const success = await (0, wordpressService_1.unmarkAsSent)(productId);
    if (success) {
        await ctx.reply(`🧹 وضعیت ارسال محصول ${productId} حذف شد.`);
    }
    else {
        await ctx.reply(`❌ خطا در حذف وضعیت ارسال برای ${productId}`);
    }
}
