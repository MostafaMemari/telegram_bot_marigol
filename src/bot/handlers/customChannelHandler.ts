import { InlineKeyboard } from "grammy";
import { MyContext } from "..";

export async function customChannelHandler(ctx: MyContext) {
  const data = ctx.callbackQuery?.data;
  if (!data) return;
  await ctx.answerCallbackQuery();

  const [_, __, productId, channelId] = data.split("_");
  ctx.session.waitingForCustomTime = { productId, channelId };

  const keyboard = new InlineKeyboard().text("❌ لغو", `cancel_custom_time_${productId}`);

  await ctx.reply("⏰ لطفا زمان دلخواه خود را وارد کنید (مثلاً 10:45)", {
    reply_markup: keyboard,
  });
}
