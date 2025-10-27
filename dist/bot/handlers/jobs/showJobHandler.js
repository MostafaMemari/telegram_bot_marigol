"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showJobHandler = showJobHandler;
const grammy_1 = require("grammy");
const scheduler_1 = require("../../../utils/scheduler");
async function showJobHandler(ctx) {
    if (!ctx.callbackQuery?.data)
        return;
    const data = ctx.callbackQuery.data;
    const jobId = Number(data.split("_")[2]);
    const jobs = (0, scheduler_1.readJobs)();
    const job = jobs.find((j) => j.id === jobId);
    if (!job)
        return;
    const product = JSON.parse(job.productDetails);
    const keyboard = new grammy_1.InlineKeyboard().text("❌ حذف", `remove_job_${job.id}`);
    const caption = `
📝 محصول: ${product.postTitle}
⏰ زمان: ${job.time}
📢 کانال: @${job.channelName}
`;
    if (product.mainImage)
        await ctx.replyWithPhoto(product.mainImage, { caption, reply_markup: keyboard });
    else
        await ctx.reply(caption, { reply_markup: keyboard });
    try {
        await ctx.answerCallbackQuery();
    }
    catch (err) {
        console.warn("⚠️ Callback expired:", err.description);
    }
}
