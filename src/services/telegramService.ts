import TelegramBot from "node-telegram-bot-api";
import { Product } from "../interfaces/product";

const BOT_TOKEN = process.env.BOT_TOKEN || "";

const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME || "@marigol_ir";
const bot = new TelegramBot(BOT_TOKEN);

export class TelegramService {
  static async sendPhoto(product: Product): Promise<void> {
    const { mainImage, guid, postTitle, tags, categories } = product;
    const tagsText = tags.length > 0 ? tags.map((tag) => `#${tag.replace(/\s+/g, "_")}`).join(" ") : "";
    const categoriesText = categories.length > 0 ? categories.map((cat) => `#${cat.replace(/\s+/g, "_")}`).join(" ") : "";
    const caption =
      `📌 <b>${postTitle}</b>\n\n` +
      `${tagsText || categoriesText ? `🏷️ <b>تگ‌ها:</b> ${tagsText} ${categoriesText}\n\n` : ""}` +
      `🌍 <b><a href='https://marigol.ir'>وبسایت ما</a></b>\n` +
      `📸 <b><a href='https://www.instagram.com/marigol.ir'>اینستاگرام ما</a></b>\n` +
      `📢 <b>${CHANNEL_USERNAME} | ماری‌گل</b>`;

    try {
      if (mainImage) {
        await bot.sendPhoto(CHANNEL_USERNAME, mainImage, {
          caption,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[{ text: "دریافت از سایت ⬇️", url: guid }]],
          },
        });
      }
    } catch (error) {
      console.error("Error sending photo to Telegram:", error);
      throw error;
    }
  }

  static async sendDocument(fileUrl: string, fileName: string): Promise<void> {
    try {
      await bot.sendDocument(CHANNEL_USERNAME, fileUrl);
    } catch (error) {
      console.error(`Error sending document ${fileName} to Telegram:`, error);
      throw error;
    }
  }
}
