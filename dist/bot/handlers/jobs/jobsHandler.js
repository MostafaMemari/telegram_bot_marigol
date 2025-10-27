"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobsHandler = jobsHandler;
const grammy_1 = require("grammy");
const scheduler_1 = require("../../../utils/scheduler");
async function jobsHandler(ctx) {
    const jobs = (0, scheduler_1.readJobs)();
    if (!jobs.length) {
        await ctx.reply("❌ هیچ زمان‌بندی فعالی وجود ندارد");
        return;
    }
    const keyboard = new grammy_1.InlineKeyboard();
    for (const job of jobs) {
        const product = JSON.parse(job.productDetails);
        const fullTitle = product.postTitle;
        const shortTitle = fullTitle.split(" ").slice(0, 4).join(" ") + (fullTitle.split(" ").length > 4 ? "..." : "");
        keyboard.text(`${job.time} - ${product.id} - ${shortTitle}`, `show_job_${job.id}`).row();
    }
    await ctx.reply("⏰ زمان‌بندی‌های فعالی که ثبت شده‌اند:", {
        reply_markup: keyboard,
    });
}
