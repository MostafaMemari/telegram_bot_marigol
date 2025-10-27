"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeJobHandler = removeJobHandler;
const scheduler_1 = require("../../../utils/scheduler");
async function removeJobHandler(ctx) {
    if (!ctx.callbackQuery?.data)
        return;
    const data = ctx.callbackQuery.data;
    try {
        await ctx.answerCallbackQuery();
    }
    catch (err) {
        console.warn("⚠️ Callback query expired or invalid:", err.description);
    }
    const jobId = Number(data.split("_")[2]);
    (0, scheduler_1.removeJob)(jobId);
    await ctx.reply(`🗑️ زمان‌بندی ${jobId} حذف شد`);
}
