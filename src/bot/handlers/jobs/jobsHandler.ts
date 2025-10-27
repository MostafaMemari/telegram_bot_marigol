import { Context, InlineKeyboard } from "grammy";
import { readJobs } from "../../../utils/scheduler";

export async function jobsHandler(ctx: Context) {
  const jobs = readJobs();
  if (!jobs.length) {
    await ctx.reply("❌ هیچ زمان‌بندی فعالی وجود ندارد");
    return;
  }

  const keyboard = new InlineKeyboard();

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
