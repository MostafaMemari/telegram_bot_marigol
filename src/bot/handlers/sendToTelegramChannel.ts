import { bot } from "..";
import { sendProductFile } from "../../handlers/downloadFileHandler";
import { formatProduct } from "../../handlers/productFormatter";
import { getProductById, markAsSent, publishProduct } from "../../services/wordpressService";

export async function sendToTelegramChannel(productId: string, channelKey: string) {
  const product = await getProductById(productId);

  if (!product) return console.error("❌ محصول پیدا نشد.");

  await publishProduct(productId);
  await markAsSent(productId);

  const formatted = formatProduct(product);

  const keyboard = { inline_keyboard: [[{ text: "دریافت از سایت ⬇️", url: `https://marigol.ir?p=${productId}` }]] };

  if (formatted.photoUrl) {
    await bot.api.sendPhoto(channelKey, formatted.photoUrl, { caption: formatted.msg, parse_mode: "HTML", reply_markup: keyboard });
  } else {
    await bot.api.sendMessage(channelKey, formatted.msg, { parse_mode: "HTML", reply_markup: keyboard });
  }
  if (formatted.fileUrl) {
    await sendProductFile({ api: bot.api } as any, formatted.fileUrl, String(formatted.productId), channelKey);
  }

  console.log(`✅ محصول ${productId} به ${channelKey} ارسال شد.`);
}
