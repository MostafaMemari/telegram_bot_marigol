import { Context } from "grammy";
import { publishProduct } from "../../services/wordpressService";

export async function publishProductHandler(ctx: Context) {
  const productId = ctx.callbackQuery?.data?.split("_")[1];
  if (!productId) return;

  try {
    await ctx.answerCallbackQuery();

    const success = await publishProduct(productId);

    if (success) {
      await ctx.reply(`✅ محصول با شناسه ${productId} با موفقیت منتشر شد.`);
    } else {
      await ctx.reply(`❌ خطا در انتشار محصول ${productId}.`);
    }
  } catch (err) {
    console.error("🚨 خطا در publishProductHandler:", err);
    await ctx.reply(`⚠️ خطایی هنگام انتشار محصول ${productId} رخ داد.`);
  }
}
