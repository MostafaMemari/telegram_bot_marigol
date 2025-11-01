import { InlineKeyboard } from "grammy";
import { MyContext } from "../../api/bot";
import { getProductById } from "../../services/wordpressService";
import { addJob } from "../../utils/scheduler";

export async function customTimeMessageHandler(ctx: MyContext) {
  if (!ctx.session.waitingForCustomTime) return;

  const { productId, channelId } = ctx.session.waitingForCustomTime;
  const time = ctx.message?.text?.trim();
  const chatId = ctx.chat?.id!;
  const messageId = ctx.message?.message_id!;

  const keyboard = new InlineKeyboard().text("❌ لغو", `cancel_custom_time_${productId}`);

  if (!time || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
    await ctx.reply("⚠️ لطفاً زمان را به‌صورت HH:MM وارد کنید (مثلاً 09:15 یا 22:45)", {
      reply_markup: keyboard,
    });
    return;
  }

  const product = await getProductById(productId);

  await addJob({
    productId,
    time,
    chatId,
    messageId,
    productDetails: JSON.stringify(product),
    channelId,
  });

  await ctx.reply(`✅ محصول ${productId} برای ساعت ${time} در کانال انتخاب‌شده زمان‌بندی شد!`);

  ctx.session.waitingForCustomTime = undefined;
}
