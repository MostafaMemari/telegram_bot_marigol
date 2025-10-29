import { Context } from "grammy";
import { getProductById } from "../../services/wordpressService";
import { addJob } from "../../utils/scheduler";

export async function scheduleHandler(ctx: Context) {
  try {
    if (!ctx.callbackQuery?.data) return;
    await ctx.answerCallbackQuery();

    const data = ctx.callbackQuery.data;

    const [_, productId, time, channelId] = data.split("_");

    const chatId = ctx.callbackQuery.message?.chat.id!;
    const messageId = ctx.callbackQuery.message?.message_id!;
    const product = await getProductById(productId);

    addJob({
      productId,
      time,
      chatId,
      messageId,
      productDetails: JSON.stringify(product),
      channelId,
    });

    await ctx.reply(`✅ محصول ${productId} با موفقیت برای ساعت ${time} زمان‌بندی شد`);
  } catch (err) {
    console.error("❌ خطا در زمان‌بندی:", err);
    await ctx.reply("❌ خطا در زمان‌بندی محصول.");
  }
}
