import { Context, InlineKeyboard } from "grammy";
import { channels } from "../../constants/channels";

export async function chooseChannelHandler(ctx: Context) {
  if (!ctx.callbackQuery?.data) return;
  await ctx.answerCallbackQuery();

  const data = ctx.callbackQuery.data;
  const [_, __, productId, time] = data.split("_");

  const keyboard = new InlineKeyboard()
    .text("@marigol", `schedule_${productId}_${time}_${channels.marigol}`)
    .text("@sketchup_object_material", `schedule_${productId}_${time}_${channels.sketchup_object_material}`)
    .row()
    .text("🔙 بازگشت", `select_time_${productId}`);

  const chatId = ctx.callbackQuery.message?.chat.id!;
  const messageId = ctx.callbackQuery.message?.message_id!;
  const prevCaption = ctx.callbackQuery.message?.caption || ctx.callbackQuery.message?.text || "";

  const cleanedCaption = prevCaption
    .split("\n")
    .filter((line) => !line.includes("📢 لطفا کانال مورد نظر را انتخاب کنید") && !line.includes("📅 لطفا زمان انتشار محصول را انتخاب کنید"))
    .join("\n")
    .trim();

  const newCaption = `${cleanedCaption}\n\n📢 لطفا کانال مورد نظر را انتخاب کنید:`;

  if (ctx.callbackQuery.message?.photo) {
    await ctx.api.editMessageCaption(chatId, messageId, { caption: newCaption, parse_mode: "HTML", reply_markup: keyboard });
  } else {
    await ctx.api.editMessageText(chatId, messageId, newCaption, { parse_mode: "HTML", reply_markup: keyboard });
  }
}
