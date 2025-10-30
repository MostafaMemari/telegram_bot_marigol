import { Context, InlineKeyboard } from "grammy";
import { readJobs } from "../../../utils/scheduler";

export async function showJobHandler(ctx: Context) {
  if (!ctx.callbackQuery?.data) return;

  const data = ctx.callbackQuery.data;
  const jobId = Number(data.split("_")[2]);
  const jobs = await readJobs();
  const job = jobs.find((j: any) => j.id === jobId);
  if (!job) return;

  const product = JSON.parse(job.productDetails);

  const keyboard = new InlineKeyboard().text("❌ حذف", `remove_job_${job.id}`);

  const caption = `
📝 محصول: ${product.postTitle}
⏰ زمان: ${job.time}
📢 کانال: @${job.channelName}
`;

  if (product.mainImage) await ctx.replyWithPhoto(product.mainImage, { caption, reply_markup: keyboard });
  else await ctx.reply(caption, { reply_markup: keyboard });

  try {
    await ctx.answerCallbackQuery();
  } catch (err: any) {
    console.warn("⚠️ Callback expired:", err.description);
  }
}
