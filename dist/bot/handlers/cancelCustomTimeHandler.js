"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelCustomTimeHandler = cancelCustomTimeHandler;
async function cancelCustomTimeHandler(ctx) {
    if (!ctx.callbackQuery?.data)
        return;
    ctx.session.waitingForCustomTime = undefined;
    await ctx.answerCallbackQuery();
    await ctx.reply("❌ وارد کردن زمان‌بندی لغو شد.");
}
