"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.draftsHandler = draftsHandler;
const grammy_1 = require("grammy");
const wordpressService_1 = require("../../services/wordpressService");
async function draftsHandler(ctx) {
    if (ctx.callbackQuery)
        await ctx.answerCallbackQuery();
    try {
        const drafts = await (0, wordpressService_1.getProducts)();
        if (!drafts || drafts.length === 0) {
            await ctx.reply("هیچ محصول پیش‌نویسی وجود ندارد.");
            return;
        }
        for (const p of drafts) {
            const keyboard = new grammy_1.InlineKeyboard().text("🟢 انتشار محصول", `select_time_${p.id}`);
            const msg = `📌 ${p.postTitle}\n 🔑 شناسه محصول : ${p.id}`;
            if (p.mainImage) {
                await ctx.replyWithPhoto(p.mainImage, { caption: msg, parse_mode: "HTML", reply_markup: keyboard });
            }
            else {
                await ctx.reply(msg, { parse_mode: "HTML", reply_markup: keyboard });
            }
        }
    }
    catch (err) {
        console.error(err);
        await ctx.reply("خطا در دریافت پیش‌نویس‌ها.");
    }
}
