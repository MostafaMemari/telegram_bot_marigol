import { Context, InlineKeyboard } from "grammy";
import { markAsSent, unmarkAsSent } from "../../services/wordpressService";
import { channels } from "../../constants/channels";

export async function resendHandler(ctx: Context) {
  const productId = ctx.callbackQuery?.data?.split("_")[1];
  console.log(`🔁 دکمه "ارسال مجدد" برای پست ${productId} کلیک شد.`);

  await ctx.answerCallbackQuery({ text: "📨 ارسال مجدد کلیک شد!" });

  const keyboard = new InlineKeyboard()
    .text("@marigol_ir", `resend_channel_${productId}_${channels.marigol}`)
    .text("@sketchup_object_material", `resend_channel_${productId}_${channels.sketchup_object_material}`);

  await ctx.reply("📡 لطفا کانال موردنظر را انتخاب کنید:", { reply_markup: keyboard });
}

export async function markSentHandler(ctx: Context) {
  const productId = Number(ctx.callbackQuery?.data?.split("_")[2]);
  await ctx.answerCallbackQuery();
  const success = await markAsSent(String(productId));

  if (success) {
    await ctx.reply(`✅ محصول ${productId} به عنوان ارسال‌شده ثبت شد.`);
  } else {
    await ctx.reply(`❌ خطا در ثبت وضعیت ارسال برای ${productId}`);
  }
}

export async function unmarkSentHandler(ctx: Context) {
  const productId = Number(ctx.callbackQuery?.data?.split("_")[2]);
  await ctx.answerCallbackQuery();
  const success = await unmarkAsSent(productId);

  if (success) {
    await ctx.reply(`🧹 وضعیت ارسال محصول ${productId} حذف شد.`);
  } else {
    await ctx.reply(`❌ خطا در حذف وضعیت ارسال برای ${productId}`);
  }
}
