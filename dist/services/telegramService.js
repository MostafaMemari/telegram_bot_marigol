"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME || "@marigol_ir";
const bot = new node_telegram_bot_api_1.default(BOT_TOKEN);
class TelegramService {
    static async sendPhoto(product) {
        const { mainImage, guid, postTitle, tags, categories } = product;
        const tagsText = tags.length > 0 ? tags.map((tag) => `#${tag.replace(/\s+/g, "_")}`).join(" ") : "";
        const categoriesText = categories.length > 0 ? categories.map((cat) => `#${cat.replace(/\s+/g, "_")}`).join(" ") : "";
        const caption = `📌 <b>${postTitle}</b>\n\n` +
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
        }
        catch (error) {
            console.error("Error sending photo to Telegram:", error);
            throw error;
        }
    }
    static async sendDocument(fileUrl, fileName) {
        try {
            await bot.sendDocument(CHANNEL_USERNAME, fileUrl);
        }
        catch (error) {
            console.error(`Error sending document ${fileName} to Telegram:`, error);
            throw error;
        }
    }
}
exports.TelegramService = TelegramService;
