import { Context, InlineKeyboard } from "grammy";
import { getProductById, markAsSent } from "../../services/wordpressService";
import { formatProduct } from "../../handlers/productFormatter";
import { sendProductFile } from "../../handlers/downloadFileHandler";

export async function resendToChannelHandler(ctx: Context) {
  try {
    const data = ctx.callbackQuery?.data;

    const [_, __, productId, channel] = data?.split("_") || [];

    await ctx.answerCallbackQuery();

    const product = await getProductById(productId);
    if (!product) {
      await ctx.reply("❌ خطا در دریافت محصول از وردپرس.");
      return;
    }

    const formatted = formatProduct(product);

    const keyboard = new InlineKeyboard().url("دریافت از سایت ⬇️", "https://marigol.ir");

    if (formatted.photoUrl) {
      await ctx.api.sendPhoto(channel, formatted.photoUrl, { caption: formatted.msg, parse_mode: "HTML", reply_markup: keyboard });
    } else {
      await ctx.api.sendMessage(channel, formatted.msg, { parse_mode: "HTML", reply_markup: keyboard });
    }

    if (formatted.fileUrl) await sendProductFile(ctx, formatted.fileUrl, String(formatted.productId), channel);

    await markAsSent(productId);

    await ctx.reply(`✅ محصول ${productId} با موفقیت به کانال ارسال شد`);
  } catch (error) {
    await ctx.reply("❌ خطا در ارسال پست به کانال موردنظر.");
  }
}
