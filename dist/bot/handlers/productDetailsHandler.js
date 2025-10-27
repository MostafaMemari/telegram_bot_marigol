"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productDetailsHandler = productDetailsHandler;
const grammy_1 = require("grammy");
const wordpressService_1 = require("../../services/wordpressService");
const productFormatter_1 = require("../../handlers/productFormatter");
async function productDetailsHandler(ctx) {
    if (!ctx.callbackQuery?.data)
        return;
    try {
        await ctx.answerCallbackQuery();
    }
    catch (err) {
        console.warn("⚠️ Callback query expired or invalid:", err.description);
    }
    const data = ctx.callbackQuery.data;
    const productId = data.split("_")[1];
    try {
        const product = await (0, wordpressService_1.getProductById)(productId);
        const formatted = (0, productFormatter_1.formatProduct)(product);
        const keyboard = new grammy_1.InlineKeyboard()
            .text(product.sentToTelegram ? "❌ ریست وضعیت" : "✅ ارسال‌شده", product.sentToTelegram ? `unmark_sent_${product.id}` : `mark_sent_${product.id}`)
            .text("📦 دریافت فایل", `download_${product.id}`)
            .text("🔁 ارسال مجدد", `resend_${product.id}`);
        keyboard.row().text("🔙 بازگشت به لیست", "published_page_1");
        if (product.mainImage) {
            await ctx.replyWithPhoto(product.mainImage, {
                caption: formatted.msg,
                parse_mode: "HTML",
                reply_markup: keyboard,
            });
        }
        else {
            await ctx.reply(formatted.msg, {
                parse_mode: "HTML",
                reply_markup: keyboard,
            });
        }
    }
    catch (err) {
        console.error("❌ خطا در دریافت جزئیات محصول:", err);
        await ctx.reply("🚫 خطا در دریافت جزئیات محصول.");
    }
}
