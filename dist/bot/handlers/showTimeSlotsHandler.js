"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showTimeSlotsHandler = showTimeSlotsHandler;
const grammy_1 = require("grammy");
const timeSlots_1 = require("../../utils/timeSlots");
async function showTimeSlotsHandler(ctx) {
    if (!ctx.callbackQuery?.data)
        return;
    await ctx.answerCallbackQuery();
    const data = ctx.callbackQuery.data;
    const productId = data.split("_")[2];
    const slots = (0, timeSlots_1.generateTimeSlots)(8, 11.5, 30);
    const keyboard = new grammy_1.InlineKeyboard();
    for (let i = 0; i < slots.length; i += 4) {
        for (let j = 0; j < 4 && slots[i + j]; j++) {
            keyboard.text(slots[i + j][0], `selected_time_${productId}_${slots[i + j][0]}`);
        }
        keyboard.row();
    }
    keyboard.text("⏰ زمان دلخواه", `custom_time_${productId}`).row();
    keyboard.text("🔙 بازگشت", `back_to_publish_${productId}`).row();
    const chatId = ctx.callbackQuery.message?.chat.id;
    const messageId = ctx.callbackQuery.message?.message_id;
    const prevCaption = ctx.callbackQuery.message?.caption || ctx.callbackQuery.message?.text || "";
    const cleanedCaption = prevCaption
        .split("\n")
        .filter((line) => !line.includes("📅 لطفا زمان انتشار محصول را انتخاب کنید") && !line.includes("📢 لطفا کانال مورد نظر را انتخاب کنید"))
        .join("\n")
        .trim();
    const newCaption = `${cleanedCaption}\n\n📅 لطفا زمان انتشار محصول را انتخاب کنید:`;
    if (ctx.callbackQuery.message?.photo) {
        await ctx.api.editMessageCaption(chatId, messageId, { caption: newCaption, parse_mode: "HTML", reply_markup: keyboard });
    }
    else {
        await ctx.api.editMessageText(chatId, messageId, newCaption, { parse_mode: "HTML", reply_markup: keyboard });
    }
}
