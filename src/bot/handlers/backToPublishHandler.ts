import { Context, InlineKeyboard } from "grammy";

export async function backToPublishHandler(ctx: Context) {
  if (!ctx.callbackQuery?.data) return;
  await ctx.answerCallbackQuery();

  const data = ctx.callbackQuery.data;
  const productId = data.split("_")[3];

  const keyboard = new InlineKeyboard().text("🟢 انتشار محصول", `select_time_${productId}`);

  const chatId = ctx.callbackQuery.message?.chat.id;
  const messageId = ctx.callbackQuery.message?.message_id;
  if (!chatId || !messageId) return;

  const prevCaption = ctx.callbackQuery.message?.caption || ctx.callbackQuery.message?.text || "";
  const originalTitle = prevCaption.split("\n\n")[0];

  if (ctx.callbackQuery.message?.photo) {
    await ctx.api.editMessageCaption(chatId, messageId, {
      caption: originalTitle,
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  } else {
    await ctx.api.editMessageText(chatId, messageId, originalTitle, {
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  }
}
