import { Context, InlineKeyboard } from "grammy";
import moment from "moment-timezone";
import { readJobs } from "../../../utils/scheduler";

export async function showJobHandler(ctx: Context) {
  if (!ctx.callbackQuery?.data) return;

  const data = ctx.callbackQuery.data;
  const jobId = Number(data.split("_")[2]);

  const jobs = await readJobs();
  const job = jobs.find((j: any) => j.id === jobId);
  if (!job) {
    await ctx.answerCallbackQuery({ text: "❌ این زمان‌بندی یافت نشد", show_alert: true });
    return;
  }

  const product = JSON.parse(job.productDetails);
  const keyboard = new InlineKeyboard().text("❌ حذف", `remove_job_${job.id}`);

  const iranTime = moment(job.sendAt).tz("Asia/Tehran").format("YYYY/MM/DD - HH:mm");

  const caption = `
📝 <b>محصول:</b> ${product.postTitle}
📦 <b>شناسه محصول:</b> ${product.id}
📢 <b>کانال:</b> @${job.channelName}
⏰ <b>زمان ارسال:</b> ${iranTime}
`;

  if (product.mainImage)
    await ctx.replyWithPhoto(product.mainImage, {
      caption,
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  else
    await ctx.reply(caption, {
      parse_mode: "HTML",
      reply_markup: keyboard,
    });

  try {
    await ctx.answerCallbackQuery();
  } catch (err: any) {
    console.warn("⚠️ Callback expired:", err.description);
  }
}
