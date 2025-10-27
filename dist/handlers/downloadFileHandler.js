"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendProductFile = sendProductFile;
const grammy_1 = require("grammy");
const path_1 = __importDefault(require("path"));
async function sendProductFile(ctx, fileUrl, productId, targetId) {
    if (!fileUrl) {
        await ctx.reply("🚫 لینک فایل یافت نشد.");
        return;
    }
    try {
        const ext = path_1.default.extname(new URL(fileUrl).pathname) || ".zip";
        const fileName = `${productId} - @marigol_ir${ext}`;
        const res = await fetch(fileUrl);
        if (!res.ok)
            throw new Error(`خطا در دانلود فایل: ${res.statusText}`);
        const contentLength = res.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) {
            await ctx.reply("⚠️ حجم فایل بیش از ۵۰ مگابایت است و قابل ارسال نیست");
            return;
        }
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        if (buffer.byteLength > 50 * 1024 * 1024) {
            await ctx.reply("⚠️ حجم فایل بیش از ۵۰ مگابایت است و قابل ارسال نیست");
            return;
        }
        const file = new grammy_1.InputFile(buffer, fileName);
        if (targetId) {
            await ctx.api.sendDocument(targetId, file);
        }
        else {
            await ctx.replyWithDocument(file);
        }
    }
    catch (error) {
        console.error("❌ خطا در ارسال فایل:", error);
        await ctx.reply("❌ خطا در ارسال فایل این محصول.");
    }
}
