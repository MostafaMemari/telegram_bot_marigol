import { Context } from "grammy";
import { draftProduct } from "../../services/wordpressService";

export async function draftProductHandler(ctx: Context) {
  const productId = ctx.callbackQuery?.data?.split("_")[1];
  if (!productId) return;

  try {
    await ctx.answerCallbackQuery();

    const success = await draftProduct(productId);

    console.log(success);

    if (success) {
      await ctx.reply(`📝 محصول با شناسه ${productId} با موفقیت به حالت پیش‌نویس درآمد.`);
    } else {
      await ctx.reply(`❌ خطا در تغییر وضعیت محصول ${productId} به پیش‌نویس.`);
    }
  } catch (err) {
    console.error("🚨 خطا در draftProductHandler:", err);
    await ctx.reply(`⚠️ خطایی هنگام تغییر وضعیت محصول ${productId} رخ داد.`);
  }
}
