"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFileHandler = downloadFileHandler;
const downloadFileHandler_1 = require("../../handlers/downloadFileHandler");
const wordpressService_1 = require("../../services/wordpressService");
async function downloadFileHandler(ctx) {
    if (!ctx.callbackQuery?.data)
        return;
    try {
        await ctx.answerCallbackQuery();
    }
    catch (err) {
        console.warn("⚠️ Callback query expired or invalid:", err.description);
    }
    const productId = ctx.callbackQuery.data.split("_")[1];
    try {
        const product = await (0, wordpressService_1.getProductById)(productId);
        const fileUrl = product.fileData?.["1"]?.file;
        if (!fileUrl)
            return await ctx.reply("🚫 این محصول فایل قابل دانلود ندارد.");
        await (0, downloadFileHandler_1.sendProductFile)(ctx, fileUrl, product.id);
    }
    catch (err) {
        console.error("❌ خطا در دریافت محصول برای دانلود:", err);
        await ctx.reply("🚫 خطا در دریافت محصول برای دانلود.");
    }
}
