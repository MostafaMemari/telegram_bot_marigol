"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendToChannelHandler = resendToChannelHandler;
const grammy_1 = require("grammy");
const wordpressService_1 = require("../../services/wordpressService");
const productFormatter_1 = require("../../handlers/productFormatter");
const downloadFileHandler_1 = require("../../handlers/downloadFileHandler");
async function resendToChannelHandler(ctx) {
    try {
        const data = ctx.callbackQuery?.data;
        const [_, __, productId, channel] = data?.split("_") || [];
        await ctx.answerCallbackQuery();
        const product = await (0, wordpressService_1.getProductById)(productId);
        if (!product) {
            await ctx.reply("❌ خطا در دریافت محصول از وردپرس.");
            return;
        }
        const formatted = (0, productFormatter_1.formatProduct)(product);
        const keyboard = new grammy_1.InlineKeyboard().url("دریافت از سایت ⬇️", "https://marigol.ir");
        if (formatted.photoUrl) {
            await ctx.api.sendPhoto(channel, formatted.photoUrl, { caption: formatted.msg, parse_mode: "HTML", reply_markup: keyboard });
        }
        else {
            await ctx.api.sendMessage(channel, formatted.msg, { parse_mode: "HTML", reply_markup: keyboard });
        }
        if (formatted.fileUrl)
            await (0, downloadFileHandler_1.sendProductFile)(ctx, formatted.fileUrl, String(formatted.productId), channel);
        await (0, wordpressService_1.markAsSent)(productId);
        await ctx.reply(`✅ محصول ${productId} با موفقیت به کانال ارسال شد`);
    }
    catch (error) {
        await ctx.reply("❌ خطا در ارسال پست به کانال موردنظر.");
    }
}
