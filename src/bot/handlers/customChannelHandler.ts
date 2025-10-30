import { InlineKeyboard } from "grammy";
import { MyContext } from "../../api/bot";

export async function customChannelHandler(ctx: MyContext) {
  const data = ctx.callbackQuery?.data;
  if (!data) return;

  try {
    await ctx.answerCallbackQuery();
  } catch (error) {
    console.warn("⚠️ Callback query error (ignored):", error);
  }

  const [_, __, productId, channelId] = data.split("_");
  ctx.session.waitingForCustomTime = { productId, channelId };

  const keyboard = new InlineKeyboard().text("❌ لغو", `cancel_custom_time_${productId}`);

  await ctx.reply("⏰ زمان (HH:MM) را وارد کنید:", {
    reply_markup: keyboard,
  });
}
