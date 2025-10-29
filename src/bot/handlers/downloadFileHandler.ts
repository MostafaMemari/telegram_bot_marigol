import { Context } from "grammy";
import { getProductById } from "../../services/wordpressService";
import { sendProductFile } from "../../handlers/downloadFileHandler";

export async function downloadFileHandler(ctx: Context) {
  if (!ctx.callbackQuery?.data) return;

  try {
    await ctx.answerCallbackQuery();
  } catch (err: any) {
    console.warn("⚠️ Callback query expired or invalid:", err.description);
  }

  const productId = ctx.callbackQuery.data.split("_")[1];

  try {
    const product = await getProductById(productId);

    const fileUrl = product.fileData?.["1"]?.file;

    if (!fileUrl) return await ctx.reply("🚫 این محصول فایل قابل دانلود ندارد.");

    await sendProductFile(ctx, fileUrl, product.id);
  } catch (err) {
    console.error("❌ خطا در دریافت محصول برای دانلود:", err);
    await ctx.reply("🚫 خطا در دریافت محصول برای دانلود.");
  }
}
