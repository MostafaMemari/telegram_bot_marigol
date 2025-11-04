import { Context, InlineKeyboard } from "grammy";
import { getProductById } from "../../services/wordpressService";
import { formatProduct } from "../../handlers/productFormatter";

export async function productDetailsHandler(ctx: Context) {
  if (!ctx.callbackQuery?.data) return;

  try {
    await ctx.answerCallbackQuery();
  } catch (err: any) {
    console.warn("⚠️ Callback query expired or invalid:", err.description);
  }

  const data = ctx.callbackQuery.data;
  const productId = data.split("_")[1];

  try {
    const product = await getProductById(productId);

    const formatted = formatProduct(product);

    const keyboard = new InlineKeyboard()
      .text("📦 دریافت فایل", `download_${product.id}`)
      .text("🔁 ارسال مجدد", `resend_${product.id}`)
      .text(
        product.sentToTelegram ? "❌ ریست وضعیت" : "✅ ارسال‌شده",
        product.sentToTelegram ? `unmark_sent_${product.id}` : `mark_sent_${product.id}`
      )
      .row()
      .text(
        product.status === "draft" ? "🚀 انتشار" : "📝 پیش‌نویس",
        product.status === "draft" ? `publish_${product.id}` : `draft_${product.id}`
      );

    if (product.mainImage) {
      await ctx.replyWithPhoto(`${product.mainImage}?nocache`, {
        caption: formatted.msg,
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
    } else {
      await ctx.reply(formatted.msg, {
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
    }
  } catch (err) {
    console.error("❌ خطا در دریافت جزئیات محصول:", err);
    await ctx.reply("🚫 خطا در دریافت جزئیات محصول.");
  }
}
