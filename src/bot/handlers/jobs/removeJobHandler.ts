import { Context } from "grammy";
import { removeJob } from "../../../utils/scheduler";

export async function removeJobHandler(ctx: Context) {
  if (!ctx.callbackQuery?.data) return;

  const data = ctx.callbackQuery.data;

  try {
    await ctx.answerCallbackQuery();
  } catch (err: any) {
    console.warn("⚠️ Callback query expired or invalid:", err.description);
  }

  const jobId = Number(data.split("_")[2]);
  removeJob(jobId);
  await ctx.reply(`🗑️ زمان‌بندی ${jobId} حذف شد`);
}
